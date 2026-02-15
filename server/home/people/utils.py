import cloudinary
import cloudinary.uploader
from django.conf import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True
)

def upload_image_to_cloudinary(image_file, user_id):
    """
    Upload an image to Cloudinary and return the URL
    """
    try:
        # Upload to Cloudinary with folder structure
        upload_result = cloudinary.uploader.upload(
            image_file,
            folder=f"people_images/user_{user_id}",
            resource_type="image",
            transformation=[
                {'width': 500, 'height': 500, 'crop': 'limit'},
                {'quality': 'auto'}
            ]
        )
        return {
            'success': True,
            'url': upload_result['secure_url'],
            'public_id': upload_result['public_id']
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def delete_image_from_cloudinary(public_id):
    """
    Delete an image from Cloudinary
    """
    try:
        cloudinary.uploader.destroy(public_id)
        return {'success': True}
    except Exception as e:
        return {'success': False, 'error': str(e)}