from rest_framework import viewsets, permissions
from .models import Post
from .serializers import PostSerializer

# --- Custom Permissions ---

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of an object to edit it.
    Assumes the model instance has an `author` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the author of the post.
        return obj.author == request.user


# --- ViewSets ---

class PostViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions for the Post model.
    """
    # The queryset is the collection of all Post objects in the database.
    queryset = Post.objects.all().order_by('-created_at')
    
    # The serializer class to use for converting Post objects to/from JSON.
    serializer_class = PostSerializer
    
    # The permission classes to apply.
    # IsAuthenticatedOrReadOnly: Allows read access to anyone, but write access only to authenticated users.
    # IsAuthorOrReadOnly: Our custom permission to ensure only authors can edit.
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        """
        Overrides the default create behavior to automatically set the post's author
        to the currently logged-in user.
        """
        serializer.save(author=self.request.user)