import React, {
    useState,
    useEffect
} from 'react'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {
    useSelector,
    useDispatch
} from 'react-redux'
import {
    insert
} from "../../store/friendslice"
import {
    loading_status
} from '../../store/tokenslice'
import {
    useNavigate
} from "react-router-dom";
import {
    Helmet
} from "react-helmet";
import postscribe from 'postscribe';

import "./chat.css"

import { useParams } from 'react-router';

function Chat() {
    const list = useSelector((state) => state.friends.list)
    const token = useSelector((state) => state.token.token)
    const navigate = useNavigate();
    const dispatch = useDispatch()



    var { pk } = useParams();

    var chatSocket = null;
    var roomId = null;
    var debug_mode = true

    function onStart() {}

    function onSelectFriend(userId) {
        // console.log("onSelectFriend: " + userId)
        // createOrReturnPrivateChat(userId)
        clearHighlightedFriend()
        highlightFriend(userId)
    }


    function highlightFriend(userId) {
	    // select new friend
	    document.getElementById("id_friend_container_" + userId).style.background = "#f2f2f2"
    }
    







    function clearHighlightedFriend() {
	    // clear the profile image and username of current chat
	    document.getElementById("id_other_user_profile_image").classList.add("d-none")
	    document.getElementById("id_other_user_profile_image").src = "{% static 'codingwithmitch/dummy_image.png' %}"
	    document.getElementById("id_other_username").innerHTML = ""
	}


    function disableChatLogScrollListener() {
        document.getElementById("id_chat_log").removeEventListener("scroll", chatLogScrollListener)
    }

    function chatLogScrollListener(e) {
        var chatLog = document.getElementById("id_chat_log")
        if ((Math.abs(chatLog.scrollTop) + 2) >= (chatLog.scrollHeight - chatLog.offsetHeight)) {
            getRoomChatMessages()
        }
    }

    function getRoomChatMessages() {
        var pageNumber = document.getElementById("id_page_number").innerHTML
        if (pageNumber != "-1") {
            setPageNumber("-1") // loading in progress
            chatSocket.send(JSON.stringify({
                "command": "get_room_chat_messages",
                "room_id": roomId,
                "page_number": pageNumber,
            }));
        }
    }

    function closeWebSocket() {
        if (chatSocket != null) {
            chatSocket.close()
            chatSocket = null
            clearChatLog()
            setPageNumber("1")
            disableChatLogScrollListener()
        }
    }

    function setPageNumber(pageNumber) {
        document.getElementById("id_page_number").innerHTML = pageNumber
    }

    function clearChatLog() {
        document.getElementById("id_chat_log").innerHTML = ""
    }



    function setupWebSocket(room_id) {

        console.log("setupWebSocket: " + room_id)






        clearChatLog()
        // onSelectFriend(pk)

        roomId = room_id

        // close previous socket if one is open
        closeWebSocket()

        // Correctly decide between ws:// and wss://

        var tken = token.split(" ")[1]
        var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
        if (debug_mode) {
            var ws_path = ws_scheme + '://' + "127.0.0.1:8000" + "/chat/" + roomId + "/?token=" + tken; // development
        } else {
            var ws_path = ws_scheme + '://' + window.location.host + ":8001/chat/" + roomId + "/"; // production
        }


        // console.log("Connecting to " + ws_path);
        chatSocket = new WebSocket(ws_path);

        // Handle incoming messages
        chatSocket.onmessage = function (message) {
            // Decode the JSON
            // console.log("Got chat websocket message " + message.data);
            console.log("Got websocket message.");
            var data = JSON.parse(message.data);

            // display the progress bar?
            displayChatroomLoadingSpinner(data.display_progress_bar)

            // Handle errors (ClientError)
            if (data.error) {
                console.error(data.error + ": " + data.message)
                showClientErrorModal(data.message)
                return;
            }
            // Handle joining (Client perspective)
            if (data.join) {
                console.log("Joining room " + data.join);
                getUserInfo()
                getRoomChatMessages()
                enableChatLogScrollListener()
            }
            // Handle leaving (client perspective)
            if (data.leave) {
                // do nothing
                console.log("Leaving room " + data.leave);
            }

            // user info coming in from backend
            if (data.user_info) {
                handleUserInfoPayload(data.user_info)
            }

            // Handle getting a message
            if (data.msg_type == 0 || data.msg_type == 1 || data.msg_type == 2) {
                appendChatMessage(data, false, true)
            }

            // new payload of messages coming in from backend
            if (data.messages_payload) {
                handleMessagesPayload(data.messages, data.new_page_number)
            }
        };

        chatSocket.addEventListener("open", function (e) {
            console.log("ChatSocket OPEN")
            // join chat room
            if ("{{request.user.is_authenticated}}") {
                chatSocket.send(JSON.stringify({
                    "command": "join",
                    "room": roomId
                }));
            }
        })

        chatSocket.onclose = function (e) {
            console.log('Chat socket closed.');
        };

        chatSocket.onOpen = function (e) {
            console.log("ChatSocket onOpen", e)
        }

        chatSocket.onerror = function (e) {
            console.log('ChatSocket error', e)
        }

        if (chatSocket.readyState == WebSocket.OPEN) {
            console.log("ChatSocket OPEN")
        } else if (chatSocket.readyState == WebSocket.CONNECTING) {
            console.log("ChatSocket connecting..")
        }
    }




    function displayChatroomLoadingSpinner(isDisplayed) {
        console.log("displayChatroomLoadingSpinner: " + isDisplayed)
        var spinner = document.getElementById("id_chatroom_loading_spinner")
        if (isDisplayed) {
            spinner.style.display = "block"
        } else {
            spinner.style.display = "none"
        }
    }

    function showClientErrorModal(message) {
        document.getElementById("id_client_error_modal_body").innerHTML = message
        document.getElementById("id_trigger_client_error_modal").click()
    }






    function getUserInfo() {
        chatSocket.send(JSON.stringify({
            "command": "get_user_info",
            "room_id": roomId,
        }));
    }




    function enableChatLogScrollListener() {
        document.getElementById("id_chat_log").addEventListener("scroll", chatLogScrollListener);
    }







    function handleUserInfoPayload(user_info) {
        document.getElementById("id_other_username").innerHTML = user_info['username']
        document.getElementById("id_other_user_profile_image").classList.remove("d-none")
        document.getElementById("id_user_info_container").href = "{% url 'account:view' user_id=53252623623632623 %}".replace("53252623623632623", user_info['id'])
        preloadImage(user_info['profile_image'], "id_other_user_profile_image")
    }




    function createChatMessageElement(msg, msg_id, username, profile_image, user_id, timestamp, maintainPosition, isNewMessage) {
        var chatLog = document.getElementById("id_chat_log")

        var newMessageDiv = document.createElement("div")
        newMessageDiv.classList.add("d-flex")
        newMessageDiv.classList.add("flex-row")
        newMessageDiv.classList.add("message-container")

        var profileImage = document.createElement("img")
        profileImage.addEventListener("click", function (e) {
            // selectUser(user_id)
        })
        profileImage.classList.add("profile-image")
        profileImage.classList.add("rounded-circle")
        profileImage.classList.add("img-fluid")
        profileImage.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIJQYDNoJVBAg8O8dlxb8mgwyjGuYcLcL03LdJ2ruj3Q&s"
        var profile_image_id = "id_profile_image_" + msg_id
        profileImage.id = profile_image_id
        newMessageDiv.appendChild(profileImage)

        var div1 = document.createElement("div")
        div1.classList.add("d-flex")
        div1.classList.add("flex-column")

        var div2 = document.createElement("div")
        div2.classList.add("d-flex")
        div2.classList.add("flex-row")

        var usernameSpan = document.createElement("span")
        usernameSpan.innerHTML = username
        usernameSpan.classList.add("username-span")
        usernameSpan.addEventListener("click", function (e) {
            selectUser(user_id)
        })
        div2.appendChild(usernameSpan)

        var timestampSpan = document.createElement("span")
        timestampSpan.innerHTML = timestamp
        timestampSpan.classList.add("timestamp-span")
        timestampSpan.classList.add("d-flex")
        timestampSpan.classList.add("align-items-center")
        timestampSpan.addEventListener("click", function (e) {
            selectUser(user_id)
        })
        div2.appendChild(timestampSpan)

        div1.appendChild(div2)

        var msgP = document.createElement("p")
        msgP.innerHTML = msg
        msgP.classList.add("msg-p")
        div1.appendChild(msgP)

        newMessageDiv.appendChild(div1)

        if (isNewMessage) {
            chatLog.insertBefore(newMessageDiv, chatLog.firstChild)
        } else {
            chatLog.appendChild(newMessageDiv)
        }

        if (!maintainPosition) {
            chatLog.scrollTop = chatLog.scrollHeight
        }

        preloadImage(profile_image, profile_image_id)
    }



    function appendChatMessage(data, maintainPosition, isNewMessage) {
        var messageType = data['msg_type']
        var msg_id = data['msg_id']
        var message = data['message']
        var uName = data['username']
        var user_id = data['user_id']
        var profile_image = data['profile_image']
        var timestamp = data['natural_timestamp']
        console.log(`append chat message: ${messageType} ${message} ${uName}`)

        var msg = "";
        var username = ""

        // determine what type of msg it is
        switch (messageType) {
            case 0:
                // new chatroom msg
                username = uName + ": "
                msg = message + '\n'
                createChatMessageElement(msg, msg_id, username, profile_image, user_id, timestamp, maintainPosition, isNewMessage)
                break;
            case 1:
                // User joined room
                createConnectedDisconnectedElement(message, msg_id, profile_image, user_id)
                break;
            case 2:
                // User left room
                createConnectedDisconnectedElement(message, msg_id, profile_image, user_id)
                break;
            default:
                console.log("Unsupported message type!");
                return;
        }
    }






    function handleMessagesPayload(messages, new_page_number) {
        if (messages != null && messages != "undefined" && messages != "None") {
            setPageNumber(new_page_number)
            messages.forEach(function (message) {
                appendChatMessage(message, true, false)
            })
        } else {
            setPaginationExhausted() // no more messages
        }
    }

    function preloadImage(info, test) {

    }







    function selectUser(user_id) {
        // Weird work-around for passing arg to url
        var url = "{% url 'account:view' user_id=53252623623632623 %}".replace("53252623623632623", user_id)
        var win = window.open(url, "_blank")
        win.focus()
    }


    function validateText(text) {

    }









    function createConnectedDisconnectedElement(msg, msd_id, profile_image, user_id) {
        var chatLog = document.getElementById("id_chat_log")

        var newMessageDiv = document.createElement("div")
        newMessageDiv.classList.add("d-flex")
        newMessageDiv.classList.add("flex-row")
        newMessageDiv.classList.add("message-container")

        var profileImage = document.createElement("img")
        profileImage.addEventListener("click", function (e) {
            selectUser(user_id)
        })
        profileImage.classList.add("profile-image")
        profileImage.classList.add("rounded-circle")
        profileImage.classList.add("img-fluid")
        profileImage.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIJQYDNoJVBAg8O8dlxb8mgwyjGuYcLcL03LdJ2ruj3Q&s"
        var profile_image_id = "id_profile_image_"
        profileImage.id = profile_image_id
        newMessageDiv.appendChild(profileImage)

        var usernameSpan = document.createElement("span")
        usernameSpan.innerHTML = msg
        usernameSpan.classList.add("username-span")
        usernameSpan.addEventListener("click", function (e) {
            selectUser(user_id)
        })
        newMessageDiv.appendChild(usernameSpan)

        chatLog.insertBefore(newMessageDiv, chatLog.firstChild)

        preloadImage(profile_image, profile_image_id)
    }








    function setPaginationExhausted() {
        setPageNumber("-1")
    }


    function fetchData(page) {
        dispatch(loading_status(true))
        fetch('http://127.0.0.1:8000/api/account/friend_list?ordering=-pk', {
                headers: {
                    "Authorization": token
                },
            })
            .then((response) => response.json())
            .then((result) => {
                dispatch(insert(result))
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally((error) => {
                dispatch(loading_status(false))
            })
    }

    function getRoomId(pk) {
        console.log("sdlfksdjflksjdfkl")
        dispatch(loading_status(true))
        fetch('http://127.0.0.1:8000/api/account/get_private_room_id/' + pk, {
                headers: {
                    "Authorization": token
                },
            })
            .then((response) => response.json())
            .then((result) => {
                setupWebSocket(result["room"])
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally((error) => {
                dispatch(loading_status(false))
            })
    }

    function friendFunctions(pk, type) {
        var url = "http://127.0.0.1:8000/api/account/"
        if (type == 1) { //send friend request
            url = url + `friend_request/${pk}`
        } else if (type == 2) { //accept friend request
            url = url + `accept_friend_request/${pk}`
        } else if (type == 3) { //unfriend friend
            url = url + `unfriend/${pk}`
        } else {

        }
        dispatch(loading_status(true))
        fetch(url, {
                headers: {
                    "Authorization": token
                },
            })
            .then((response) => response.json())
            .then((result) => {
                fetchData(1)
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally((error) => {
                dispatch(loading_status(false))
            })
    }

    function getUrl(url) {
        const domain = "http://127.0.0.1:8000"
        return `${domain}${url}`
    }




    function chatClick(pk) {
        navigate("/friend/" + pk)

        getRoomId(pk)
    }
    useEffect(() => {

        // pk = useParams();
        console.log("use effect " + pk)
        fetchData(1)
        getRoomId(pk)
        document.getElementById('id_chat_message_input').focus();
        document.getElementById('id_chat_message_input').onkeyup = function (e) {
            if (e.keyCode === 13 && e.shiftKey) { // enter + return
                // Handled automatically by textarea
            } else if (e.keyCode === 13 && !e.shiftKey) { // enter + !return
                document.getElementById('id_chat_message_submit').click();
            }
        };

        document.getElementById('id_chat_message_submit').onclick = function (e) {
            const messageInputDom = document.getElementById('id_chat_message_input');
            const message = messageInputDom.value;
            chatSocket.send(JSON.stringify({
                "command": "send",
                "message": message,
                "room": roomId
            }));
            messageInputDom.value = '';
        };
    }, []);


    return (
        <>
            
            <div>
                <div className="container">
                    <div className="row">
                    <div className="col-sm-9 m-0 p-2">
                        <div className="card" id="id_chatroom_card">
                        <div
                            className="d-flex flex-row align-items-center card-header"
                            id="id_room_title"
                        >
                            <a
                            className="d-flex flex-row"
                            target="_blank"
                            id="id_user_info_container"
                            >
                            <img
                                className="profile-image rounded-circle img-fluid"
                                id="id_other_user_profile_image"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIJQYDNoJVBAg8O8dlxb8mgwyjGuYcLcL03LdJ2ruj3Q&s"
                            />
                            <h3 className="ml-2" id="id_other_username" />
                            </a>
                        </div>
                        <div className="card-body p-1">
                            <div className="d-flex flex-column" id="id_chat_log_container">
                            <div
                                className="d-flex flex-row justify-content-center"
                                id="id_chatroom_loading_spinner_container"
                            >
                                <div
                                className="spinner-border text-primary"
                                id="id_chatroom_loading_spinner"
                                role="status"
                                style={{ display: "none" }}
                                >
                                <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                            <div className="d-flex chat-log" id="id_chat_log"></div>
                            <span
                                className="d-none page-number"
                                id="id_page_number"
                            >
                                1
                            </span>
                            <div className="d-flex flex-row chat-message-input-container">
                                <textarea
                                className="flex-grow-1 chat-message-input"
                                id="id_chat_message_input"
                                defaultValue={""}
                                />
                                <button className="btn btn-primary chat-message-submit-button">
                                <span id="id_chat_message_submit" className="material-icons">
                                    send
                                </span>
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="col-sm-3 m-0 p-2">
                        <div className="card">
                        <div className="d-flex flex-row align-items-center card-header">
                            <h3>Friends</h3>
                        </div>
                        <div className="card-body p-1">
                                    <div className="d-flex flex-column friends-list-container ">
                                        {list.map((item) => <>
                                            <div className="d-flex flex-row p-2 friend-container flex-grow-1" onClick={(e) => chatClick(item["pk"])} id="id_friend_container_{{x.friend.id}}">
							<img className="profile-image rounded-circle img-fluid" id="id_friend_img_{{x.friend.id}}" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIJQYDNoJVBAg8O8dlxb8mgwyjGuYcLcL03LdJ2ruj3Q&s" />
							<div className="d-flex flex-column">
                                                    <span className="username-span">{ item["username"] }</span>
                                                    <span className="friend-message-span">{ item["email"] }</span>
							</div>
						</div>
                                        </>)}
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <button
                    type="button"
                    id="id_trigger_client_error_modal"
                    className="d-none btn btn-primary"
                    data-toggle="modal"
                    data-target="#id_client_error_modal"
                ></button>
                <div
                    className="modal fade"
                    id="id_client_error_modal"
                    tabIndex={-1}
                    role="dialog"
                >
                    <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                        <h5 className="modal-title">Socket Client Error</h5>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                        </div>
                        <div className="modal-body">
                        <p id="id_client_error_modal_body">Something went wrong.</p>
                        </div>
                        <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            id="id_client_error_modal_close_btn"
                        >
                            Close
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>;

        </>
    );
}
export default Chat