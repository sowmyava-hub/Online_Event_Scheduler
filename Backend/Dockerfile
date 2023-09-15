FROM python:3.11

WORKDIR /app

COPY requirements.txt /app/
RUN apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y python3-dev default-libmysqlclient-dev build-essential
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

ENV FLASK_APP=app.py

EXPOSE 5000

# Start the Flask app
CMD ["flask", "run", "--host=0.0.0.0"]

