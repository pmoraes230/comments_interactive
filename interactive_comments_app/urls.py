from django.urls import path
from django.conf.urls.static import static
from interactive_comments import settings
from .views import main, add_comment, add_reply, like, delete_comment, edit_comment

urlpatterns = [
    path('', main, name='comentarios'),
    path('add-comment/', add_comment, name='add_comment'),
    path('add-reply/', add_reply, name='add_reply'),
    path('like/', like, name='like'),
    path('delete-comment/', delete_comment, name='delete_comment'),
    path('edit-comment/', edit_comment, name='edit_comment'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)