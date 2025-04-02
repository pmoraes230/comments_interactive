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

    // Apagar um comentário
document.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', () => {
        const commentId = button.getAttribute('data-comment-id');
        if (!confirm('Tem certeza que deseja apagar este comentário?')) return;

        fetch('/delete-comment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
            },
            body: JSON.stringify({ comentario_id: commentId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove o comentário do DOM
                const commentElement = button.closest('.comment');
                commentElement.remove();
            }
        });
    });
});

// Editar um comentário
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', () => {
        const commentId = button.getAttribute('data-comment-id');
        const commentElement = button.closest('.comment');
        const commentBody = commentElement.querySelector('.comment-body p');
        const originalText = commentBody.textContent;

        const editContainer = document.createElement('div');
        editContainer.classList.add('edit-comment');
        editContainer.innerHTML = `
            <textarea class="edit-textarea" style="resize: none;">${originalText}</textarea>
            <button class="save-edit-btn">Save</button>
            <button class="cancel-edit-btn">Cancel</button>
        `;

        commentBody.replaceWith(editContainer);

        // Salvar edição
        editContainer.querySelector('.save-edit-btn').addEventListener('click', () => {
            const newText = editContainer.querySelector('.edit-textarea').value.trim();
            if (!newText) return;

            fetch('/edit-comment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),
                },
                body: JSON.stringify({ comentario_id: commentId, novo_texto: newText }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const updatedCommentBody = document.createElement('p');
                        updatedCommentBody.textContent = newText;
                        editContainer.replaceWith(updatedCommentBody);
                    }
                });
        });

        // Cancelar edição
        editContainer.querySelector('.cancel-edit-btn').addEventListener('click', () => {
            const originalCommentBody = document.createElement('p');
            originalCommentBody.textContent = originalText;
            editContainer.replaceWith(originalCommentBody);
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