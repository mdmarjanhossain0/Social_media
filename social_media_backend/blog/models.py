from django.db import models
from django.conf import settings
from django.db.models.signals import post_delete, pre_save, post_save
from django.dispatch import receiver


from slugify import slugify

from datetime import datetime


def upload_location(instance, filename, **kwargs):
	file_path = 'blog/{author_id}/{datetime}-{filename}'.format(
			author_id=str(instance.author.id), datetime=str(datetime.now()), filename=filename
		) 
	return file_path


class BlogPost(models.Model):
	# title 				= models.CharField(max_length=50, null=False, blank=True)
	body 				= models.TextField(max_length=5000, null=False, blank=True)
	image 				= models.ImageField(upload_to=upload_location, null=False, blank=True)
	date_published 		= models.DateTimeField(auto_now_add=True, verbose_name="date published")
	date_updated 		= models.DateTimeField(auto_now=True, verbose_name="date updated")
	author 				= models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	# slug 				= models.SlugField(blank=True, unique=True)

	# def __str__(self):
	# 	return self.title

@receiver(post_delete, sender=BlogPost)
def submission_delete(sender, instance, **kwargs):
	instance.image.delete(False)

# def pre_save_blog_post_receiever(sender, instance, *args, **kwargs):
# 	if not instance.slug:
# 		slug = slugify(instance.author.username + "-" + instance.title)
# 		if not BlogPost.objects.filter(slug=slug).exists():
# 				instance.slug = slug
# 		else:
# 			old_slug = BlogPost.objects.filter(title=instance.title).order_by("-pk")[0].slug
# 			print(old_slug)
# 			try:
# 				num = int(old_slug.split("-")[-1])
# 				print(num)
# 				slug = slugify(instance.author.username + "-" + instance.title + "_" + str(num + 1))
# 				instance.slug = slug
# 			except:
# 				slug = slugify(instance.author.username + "-" + instance.title + "_" + str(1))
# 				instance.slug = slug

# pre_save.connect(pre_save_blog_post_receiever, sender=BlogPost)