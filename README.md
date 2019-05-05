# Automated_Abusive_Comment_Detector  

An Automated Abusive Comment Detector analyses the comment text on social posts and checks the context for abuse and inappropriate language using the concept of sentiment analysis and NLP principles.  
Also has a complementary functionality of Spam Classification for the same comment.  
It then generates notification warning to the user about their respective statements and to alter it or
face consecutive actions.  



## How to run  
#### Requirements:  
Anaconda including nltk for python with Stopwords corpus.  
MongoDB  
NodeJs  

### * Jupyter  
If you want to see the complete implementation of the algo working in background open your IPython and run the notebook from the folder **Notebook** 'Abusive Comment Classifier (Working).ipynb'

### * Full Frontend Website  
The frontend runs the minimal python code from the notebook through the saved pickle models.  

1) Run the MongoDB Server  
C:\Program Files\MongoDB\Server\4.0\bin>mongod.exe --dbpath "<DATABASE PATH>"  

2) Run the 'app.js' file from the folder **StoryBooksFull**  
node .\app.js     

3) Login through google and get started.  
