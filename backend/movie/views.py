from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import MovieSerializer
from .models import MovieInfo
from django.conf import settings
from django.conf.urls.static import static

from urllib.parse import urlparse
from urllib.request import urlopen
from django.core.files.base import ContentFile

from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
# Create your views here.

class MovieView(APIView):
    def get(self, request):
        movies = MovieInfo.objects.all()
        serializer = MovieSerializer(movies, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
            
    def post(self, request):
        print("============BASE DIR============")
        print(settings.BASE_DIR)
        print("============MEDIA DIR============")
        print(static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT))
        print(request.data)  
        serializer = MovieSerializer(data=request.data)
        #print(serializer) 
        if serializer.is_valid():
            serializer.save()
            movie = MovieInfo.objects.get(id = serializer.data['id'])
            img_url = serializer.data['poster_url']
            name = urlparse(img_url).path.split('/')[-1]
            content = ContentFile(urlopen(img_url).read())
            movie.poster.save(name, content, save=True)
            serializer = MovieSerializer(movie)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SingleMovieView(APIView):
    def get(self, request,movie_id):
        movies = MovieInfo.objects.filter(id = movie_id)
        serializer = MovieSerializer(movies, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)
    def delete(self, request,movie_id):
        print("delete: "+str(movie_id))
        movie= MovieInfo.objects.get(id=movie_id)
        movie.delete()
        return Response({"status": "success"}, status=status.HTTP_200_OK)

class UpdateMovieView(APIView):
    def put(self, request,movie_id,type_id):
        movie = MovieInfo.objects.get(id = movie_id)
        if(type_id):
            likes = movie.likes
            movie.likes=likes+1
            movie.save()
        else:
            dislikes = movie.dislikes
            movie.dislikes=dislikes+1
            movie.save()
        serializer = MovieSerializer(movie, many=False)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

def valid_url(to_validate:str) -> bool:
    validator = URLValidator()
    try:
        validator(to_validate)
        # url is valid here
        # do something, such as:
        return True
    except ValidationError as exception:
        # URL is NOT valid here.
        # handle exception..
        print(exception)
        return False