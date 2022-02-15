FROM python:3.7.11

# Install curl
RUN apt update && apt -y install curl

# Installing Node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - 
RUN apt-get install -y nodejs

# Copy files
COPY . /diplomacy
WORKDIR "/diplomacy"

# Install dependencies:
RUN pip3 install -r requirements_dev.txt 

# Build node modules for the UI.
RUN cd diplomacy/web \
    && npm install . \
    && npm install --only=dev


# Install and run Pressgloss from .whl
RUN pip3 install pressgloss-0.0.1-py3-none-any.whl


# The following two cmds are moved to the docker-compose, and only 
# left here for reference.

# Default Command - launch the game server
#EXPOSE 8432
#ENTRYPOINT []
#CMD ["python3", "diplomacy/server/run.py", "--port", "8432"]

# Default Command - launch UI
#EXPOSE 3000
#ENTRYPOINT npm start --prefix diplomacy/web
#CMD ["npm", "start", "--prefix", "diplomacy/web"]
