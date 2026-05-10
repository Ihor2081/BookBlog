from ..schemas.comment import CommentResponse


def to_comment_response(comment, is_registered: bool):
    data = CommentResponse.model_validate(comment)
    data.is_registered = is_registered
    return data