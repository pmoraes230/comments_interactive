from django.contrib import admin
from .models import Perfil, Comentario, Resposta, Like

# Register your models here.
admin.site.register(Perfil)
admin.site.register(Comentario)
admin.site.register(Resposta)
admin.site.register(Like)