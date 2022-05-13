from django.urls import path
from .views import MovieView, SingleMovieView,UpdateMovieView

urlpatterns = [
    path('', MovieView.as_view()),
    path('<int:movie_id>/', SingleMovieView.as_view()),
    path('<int:movie_id>/<int:type_id>/', UpdateMovieView.as_view()),
]