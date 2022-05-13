from django.db import models

# Create your models here.

class MovieInfo(models.Model):
    title = models.CharField(verbose_name="Title", max_length=50)
    poster = models.ImageField(verbose_name="Poster",upload_to='movies/',null=True)
    poster_url = models.URLField()
    description = models.TextField(verbose_name="Plot")
    released = models.DateField(verbose_name="Released Date")
    director = models.CharField(verbose_name="Directors", max_length=50)
    actors = models.CharField(verbose_name="Actors", max_length=100)

    likes = models.IntegerField(verbose_name="Likes")
    dislikes = models.IntegerField(verbose_name="Dislikes")
    
    class Meta:
        verbose_name = 'Movie'

    def __str__(self):
        return self.title