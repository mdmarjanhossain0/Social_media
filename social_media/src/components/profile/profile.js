import React from "react"

function Profile() {

    return (
        <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7">
              <div className="card">
                <div className="rounded-top text-white d-flex flex-row" style={{backgroundColor: '#000', height: '200px'}}>
                  <div className="ms-4 mt-5 d-flex flex-column" style={{width: '150px'}}>
                    <img src="https://media.istockphoto.com/id/1365223878/photo/attractive-man-feeling-cheerful.jpg?b=1&s=170667a&w=0&k=20&c=Pt_reBU6pAQV6cXnIcBSLdtYSB4a_8MJM4qWAO_0leU=" alt="Genericplaceholderimage" className="img-fluid img-thumbnail mt-4 mb-2" style={{width: '150px', zIndex: 1}} />
                  </div>
                  <div className="ms-3" style={{marginTop: '130px'}}>
                    <h5>Andy Horwitz</h5>
                    <p>New York</p>
                  </div>
                </div>
                <div className="card-body p-4 text-black">
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1">About</p>
                    <div className="p-4" style={{backgroundColor: '#f8f9fa'}}>
                      <p className="font-italic mb-1">Web Developer</p>
                      <p className="font-italic mb-1">Lives in New York</p>
                      <p className="font-italic mb-0">Photographer</p>
                    </div>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <p className="lead fw-normal mb-0">Recent photos</p>
                    <p className="mb-0"><a href="#!" className="text-muted">Show all</a></p>
                  </div>
                  <div className="row g-2">
                    <div className="col mb-2">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp" alt="image1" className="w-100 rounded-3" />
                    </div>
                    <div className="col mb-2">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp" alt="image1" className="w-100 rounded-3" />
                    </div>
                  </div>
                  <div className="row g-2">
                    <div className="col">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp" alt="image1" className="w-100 rounded-3" />
                    </div>
                    <div className="col">
                      <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp" alt="image1" className="w-100 rounded-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}


export default Profile