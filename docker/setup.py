import subprocess
import os
from time import sleep

class Setup:
    def __init__(self):
        self.dockerProcess: subprocess.Popen = None
        self.setup()

    def setup(self):
        print("\n----\nSetting up Docker services...")
        self.dockerProcess = subprocess.Popen(["docker", "stack", "deploy", "-c", "docker-compose.yaml", "stocksensai_dev"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        print("This may take a few minutes...")
        self.dockerProcess.wait()
        if self.dockerProcess.returncode != 0:
            print("\033[91mError: Docker setup failed\033[0m")
            print(f"\033[91m{self.dockerProcess.stderr.read().decode()}[0m]")
            os._exit(1)
        else:
            os.system('clear')
            print("\033[92mDocker setup successful\033[0m")
            print("Starting services...")
            return


    def teardown(self):
        print("\n----\nTearing down Docker services...")
        self.dockerProcess = subprocess.Popen(["docker", "stack", "rm", "stocksensai_dev"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)


        self.dockerProcess.wait()
        if self.dockerProcess.returncode != 0:
            print("\033[91mError: Docker teardown failed\033[0m")
            print(f"\033[91m{self.dockerProcess.stderr.read().decode()}[0m]")
            os._exit(1)
        else:
            print("\033[92mDocker teardown successful\033[0m")
            return

    def command(self, cmd: str):
        return subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

        



if __name__ == "__main__":
    setup = Setup()
    
    try:
        while True:
            sleep(5)
            os.system('clear')
            os.system('docker service ls')
            print("\n---\nPress Ctrl+C to exit")
    except KeyboardInterrupt:
        setup.teardown()
        print("Exiting...")
        exit(0)
        
        