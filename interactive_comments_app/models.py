from django.db import models

# Create your models here.
class Perfil(models.Model):
    nome = models.CharField(max_length=100)
    foto_perfil = models.ImageField(upload_to="")

    def __str__(self):
        return self.nome
    
class Comentario(models.Model):
    nome = models.CharField(max_length=100)
    comentario = models.TextField()
    data = models.DateTimeField(auto_now_add=True)
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='comentarios')

    def __str__(self):
        return self.nome
    
class Resposta(models.Model):
    comentario = models.ForeignKey(Comentario, on_delete=models.CASCADE, related_name='respostas')
    nome = models.CharField(max_length=100)
    resposta = models.TextField()
    data = models.DateTimeField(auto_now_add=True)
    perfil = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='respostas')

    def __str__(self):
        return self.nome
    
class Like(models.Model):
    comentario = models.ForeignKey(Comentario, on_delete=models.CASCADE, related_name='likes')
    usuario = models.ForeignKey(Perfil, on_delete=models.CASCADE, related_name='likes')
    reposta = models.ForeignKey(Resposta, on_delete=models.CASCADE, related_name='likes')
    data = models.DateTimeField(auto_now_add=True)

    # Campos para armazenar se o usuário gostou ou não do comentário
    like = models.BooleanField(default=True)
    dislike = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.usuario} - {self.comentario}"
