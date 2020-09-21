from flask import Flask, render_template, request
from flask_ngrok import run_with_ngrok
from sklearn.externals import joblib
import csv

#app initialization
app = Flask(__name__, template_folder='../templates', static_folder='../static')
run_with_ngrok(app)

# load models
input_transformer = joblib.load(open('/content/static/models/input_transformer.pkl', 'rb'))
model = joblib.load(open('/content/static/models/review_sentiment.pkl', 'rb'))

# global variables for data persistence across requests
model_input=""
model_output=""

# main index page route
@app.route('/')
def home():
    return render_template('index.html', image_filename="img/smiling-face.png", display_mode="none")

# route for prediction of sentiment analysis model and classifier
@app.route('/predict', methods=['POST'])
def predict():
    # retrieve global variables to store input and output
    global model_input
    global model_output
    
    # get text from the incoming request (submitted on predict button click)
    text = request.form['input_text']
    
    # convert text to model input vector
    final_features = input_transformer.transform([text])
    
    # use classifier's predict method to get prediction
    prediction = model.predict(final_features)
    
    # store model input and output
    model_input = text
    model_output = prediction[0]
    return model_output

if __name__ == "__main__":
    app.run()
