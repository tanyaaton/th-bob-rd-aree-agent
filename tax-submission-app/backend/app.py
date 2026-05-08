from flask import Flask, request, jsonify
from flask_cors import CORS
import database
import os

ALLOWED_INCOME_TYPE_IDS = set(range(1, 18))

app = Flask(__name__)

# Enable CORS for all routes (allows frontend from different origin)
CORS(app)

# Use environment variable for secret key in production
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

# Initialize database on startup
database.init_db()

@app.route('/')
def health_check():
    """Health check endpoint for IBM Cloud Code Engine."""
    return jsonify({
        'status': 'healthy',
        'service': 'Tax Submission API',
        'version': '1.0.0'
    }), 200

@app.route('/api/validate-user', methods=['POST'])
def validate_user():
    """Validate user by National ID and return profile from database."""
    data = request.get_json()
    national_id = data.get('national_id', '').strip()
    
    if not national_id:
        return jsonify({
            'valid': False,
            'message': 'National ID is required'
        }), 400
    
    if national_id != '1234567890123':
        return jsonify({
            'valid': False,
            'message': 'Only National ID 1234567890123 is allowed'
        }), 401
    
    user = database.get_user_by_national_id(national_id)
    
    if user:
        return jsonify({
            'valid': True,
            'message': 'User validated successfully',
            'user': {
                'name': user['name'],
                'birthday': user['birthday']
            }
        })
    else:
        return jsonify({
            'valid': False,
            'message': 'User not found'
        }), 401

@app.route('/api/submit-tax', methods=['POST'])
def submit_tax():
    """Submit a new tax form."""
    data = request.get_json()
    name = data.get('name', '').strip()
    national_id = data.get('national_id', '').strip()
    income_data = data.get('income_data', [])
    
    if not national_id:
        return jsonify({
            'success': False,
            'message': 'National ID is required'
        }), 400
    
    if not income_data or len(income_data) == 0:
        return jsonify({
            'success': False,
            'message': 'At least one income type must be selected'
        }), 400

    for index, income_item in enumerate(income_data, start=1):
        income_type = income_item.get('type')

        if income_type is None:
            return jsonify({
                'success': False,
                'message': f'Income item #{index} is missing type'
            }), 400

        try:
            income_type = int(income_type)
        except (TypeError, ValueError):
            return jsonify({
                'success': False,
                'message': f'Income item #{index} type must be a number from 1 to 17'
            }), 400

        if income_type not in ALLOWED_INCOME_TYPE_IDS:
            return jsonify({
                'success': False,
                'message': f'Income item #{index} type must be a number from 1 to 17'
            }), 400

        income_item['type'] = income_type
    
    # Validate user first
    if national_id != '1234567890123':
        return jsonify({
            'success': False,
            'message': 'Only National ID 1234567890123 is allowed'
        }), 401
    
    user = database.get_user_by_national_id(national_id)
    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid user credentials'
        }), 401
    
    name = user['name']
    
    # Submit the form
    submission_id = database.submit_tax_form(name, national_id, income_data)
    
    if submission_id:
        return jsonify({
            'success': True,
            'submission_id': submission_id,
            'message': 'Tax form submitted successfully'
        })
    else:
        return jsonify({
            'success': False,
            'message': 'Failed to submit tax form'
        }), 500

@app.route('/api/history', methods=['GET'])
def get_history():
    """Get all tax submissions."""
    try:
        submissions = database.get_all_submissions()
        return jsonify({
            'submissions': submissions
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    print("\n" + "="*50)
    print("Tax Submission API (Backend Only)")
    print("="*50)
    print(f"Server starting at: http://0.0.0.0:{port}")
    print("API Endpoints:")
    print("  POST /api/validate-user")
    print("  POST /api/submit-tax")
    print("  GET  /api/history")
    print("  GET  / (health check)")
    print("Press Ctrl+C to stop the server")
    print("="*50 + "\n")
    
    # Use debug=False for production
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=port)

# Made with Bob
