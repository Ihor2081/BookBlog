from ..schemas.comment import CommentResponse


def to_comment_response(comment, is_registered: bool):
    return CommentResponse(
        id=comment.id,
        content=comment.content,
        guest_name=comment.guest_name,
        created_at=comment.created_at,
        user_id=comment.user_id,
        post_id=comment.post_id,
        is_registered=is_registered
    )