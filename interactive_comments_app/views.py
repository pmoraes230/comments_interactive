from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Comentario, Resposta, Perfil, Like

def main(request):
    comments = Comentario.objects.all().order_by('data')
    perfils = Perfil.objects.all()
    if not perfils.exists():
        perfil = Perfil.objects.create(nome='Nome do Usuário', foto_perfil='caminho/para/imagem.jpg')
        perfils = Perfil.objects.all()
    return render(request, 'index.html', {'comentarios': comments, 'perfis': perfils})

@csrf_exempt
def add_comment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        comentario_text = data.get('comentario')
        perfil = Perfil.objects.first()  # Substitua por lógica de autenticação
        comentario = Comentario.objects.create(nome=perfil.nome, comentario=comentario_text, perfil=perfil)
        return JsonResponse({'success': True, 'id': comentario.id})
    return JsonResponse({'success': False})

@csrf_exempt
def add_reply(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        comentario_id = data.get('comentario_id')
        resposta_text = data.get('resposta')
        perfil = Perfil.objects.first()  # Substitua por lógica de autenticação
        comentario = Comentario.objects.get(id=comentario_id)
        resposta = Resposta.objects.create(comentario=comentario, nome=perfil.nome, resposta=resposta_text, perfil=perfil)
        return JsonResponse({'success': True, 'id': resposta.id})
    return JsonResponse({'success': False})

@csrf_exempt
def like(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        comment_id = data.get('comment_id')
        reply_id = data.get('reply_id')
        action = data.get('action')
        perfil = Perfil.objects.first()

        if comment_id:
            comentario = Comentario.objects.get(id=comment_id)
            like, created = Like.objects.get_or_create(usuario=perfil, comentario=comentario)
            if action == 'like':
                like.like = True
                like.dislike = False
            elif action == 'dislike':
                like.like = False
                like.dislike = True
            like.save()
            new_count = comentario.likes.filter(like=True).count()
        elif reply_id:
            resposta = Resposta.objects.get(id=reply_id)
            like, created = Like.objects.get_or_create(usuario=perfil, reposta=resposta)
            if action == 'like':
                like.like = True
                like.dislike = False
            elif action == 'dislike':
                like.like = False
                like.dislike = True
            like.save()
            new_count = resposta.likes.filter(like=True).count()

        return JsonResponse({'success': True, 'new_count': new_count})
    return JsonResponse({'success': False})

@csrf_exempt
def delete_comment(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        comentario_id = data.get('comentario_id')
        try:
            comentario = Resposta.objects.get(id=comentario_id)
            perfil = Perfil.objects.first()  
            if comentario.perfil != perfil:
                return JsonResponse({'success': False, 'error': 'Você não tem permissão para excluir este comentário'})
            Comentario.objects.filter(comentario=comentario).delete()
            comentario.delete()
            return JsonResponse({'success': True})
        except Comentario.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Comentário não encontrado'})
    return JsonResponse({'success': False, 'error': 'Método inválido'})
        
@csrf_exempt
def edit_comment(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            comentario_id = data.get('comentario_id')
            novo_texto = data.get('novo_texto')

            # Verificar se os dados são válidos
            if not comentario_id or not novo_texto.strip():
                return JsonResponse({'success': False, 'error': 'Dados inválidos'})

            # Buscar o comentário no banco de dados
            comentario = Resposta.objects.get(id=comentario_id)

            # Atualizar o comentário
            comentario.resposta = novo_texto
            comentario.save()

            return JsonResponse({'success': True})
        except Comentario.DoesNotExist:
            return JsonResponse({'success': False, 'error': 'Comentário não encontrado'})
        except Exception as e:
            return JsonResponse({'success': False, 'error': 'Erro inesperado'})
    return JsonResponse({'success': False, 'error': 'Método inválido'})