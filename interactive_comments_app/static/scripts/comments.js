document.addEventListener('DOMContentLoaded', () => {
    // Enviar novo comentário
    document.getElementById('send-comment').addEventListener('click', () => {
        const commentText = document.getElementById('new-comment').value;
        if (commentText.trim() === '') return;

        fetch('/add-comment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify({ comentario: commentText }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        });
    });

    // Responder a um comentário
    document.querySelectorAll('.reply-btn').forEach(button => {
        button.addEventListener('click', () => {
            const commentId = button.getAttribute('data-comment-id');
            const replyText = prompt('Digite sua resposta:');
            if (!replyText) return; 

            fetch('/add-reply/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                body: JSON.stringify({ comentario_id: commentId, resposta: replyText }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
        });
    });

    // Likes e Dislikes
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', () => {
            const commentId = button.getAttribute('data-comment-id');
            const replyId = button.getAttribute('data-reply-id');
            const action = button.getAttribute('data-action');

            fetch('/like/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                body: JSON.stringify({
                    comment_id: commentId || null,
                    reply_id: replyId || null,
                    action: action,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const likeCount = button.parentElement.querySelector('.like-count');
                    likeCount.textContent = data.new_count;
                }
            });
        });
    });

    // Função para obter o token CSRF
    function getCsrfToken() {
        const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
        return csrfTokenElement ? csrfTokenElement.value : '';
    }
});