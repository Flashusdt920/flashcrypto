from PyQt5.QtWidgets import (
    QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QLabel, QStackedWidget, QTabWidget, QListWidget,
    QLineEdit, QComboBox, QMessageBox
)
from PyQt5.QtCore import Qt
import sys


class Sidebar(QListWidget):
    def __init__(self):
        super().__init__()
        self.setFixedWidth(180)
        self.setStyleSheet("""
            QListWidget {
                background-color: #111;
                color: #fff;
                font-size: 15px;
                padding: 10px;
            }
            QListWidget::item:selected {
                background-color: #222;
            }
        """)
        self.addItems(["Dashboard", "Send", "Charts", "Settings", "Logout"])


class Dashboard(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        label = QLabel("⚡ Welcome to Bolt Flasher Dashboard")
        label.setStyleSheet("color: white; font-size: 20px;")
        layout.addWidget(label)
        self.setLayout(layout)


class Send(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        tabs = QTabWidget()

        for token in ["BTC", "ETH", "USDT"]:
            tabs.addTab(self.make_send_tab(token), token)

        layout.addWidget(tabs)
        self.setLayout(layout)

    def make_send_tab(self, token):
        tab = QWidget()
        layout = QVBoxLayout()

        address = QLineEdit()
        address.setPlaceholderText(f"Enter {token} wallet address")
        amount = QLineEdit()
        amount.setPlaceholderText(f"Enter amount of {token}")

        network = QComboBox()
        network.addItems(["Bitcoin Testnet", "Ethereum Goerli", "BSC", "Tron Nile"])

        send_btn = QPushButton(f"Send {token}")
        send_btn.clicked.connect(lambda: QMessageBox.information(self, "Sent", f"Sent {amount.text()} {token} to {address.text()}"))

        layout.addWidget(QLabel(f"Send {token} Transaction"))
        layout.addWidget(address)
        layout.addWidget(amount)
        layout.addWidget(network)
        layout.addWidget(send_btn)
        tab.setLayout(layout)
        return tab


class Charts(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        tabs = QTabWidget()

        for token in ["BTC", "ETH", "USDT"]:
            tabs.addTab(self.make_chart_tab(token), f"{token} Chart")

        layout.addWidget(tabs)
        self.setLayout(layout)

    def make_chart_tab(self, token):
        tab = QWidget()
        layout = QVBoxLayout()
        label = QLabel(f"Live {token} price chart goes here...")
        layout.addWidget(label)
        tab.setLayout(layout)
        return tab


class Settings(QWidget):
    def __init__(self):
        super().__init__()
        layout = QVBoxLayout()
        theme = QComboBox()
        theme.addItems(["Light", "Dark"])
        rpc = QLineEdit()
        rpc.setPlaceholderText("Custom RPC URL")
        save = QPushButton("Save Settings")
        save.clicked.connect(lambda: QMessageBox.information(self, "Saved", "Settings saved."))

        layout.addWidget(QLabel("Theme Mode"))        
        layout.addWidget(theme)
        layout.addWidget(QLabel("RPC URL"))
        layout.addWidget(rpc)
        layout.addWidget(save)
        self.setLayout(layout)


class BoltFlasherApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("⚡ Bolt Flasher")
        self.setGeometry(100, 100, 1000, 600)
        self.setStyleSheet("background-color: #1e1e1e; color: white; font-family: Segoe UI;")

        self.sidebar = Sidebar()
        self.stack = QStackedWidget()

        self.pages = {
            0: Dashboard(),
            1: Send(),
            2: Charts(),
            3: Settings(),
            4: QLabel("Logging out...")
        }

        for i in range(5):
            self.stack.addWidget(self.pages[i])

        self.sidebar.currentRowChanged.connect(self.stack.setCurrentIndex)

        main_layout = QHBoxLayout()
        main_layout.addWidget(self.sidebar)
        main_layout.addWidget(self.stack)

        container = QWidget()
        container.setLayout(main_layout)
        self.setCentralWidget(container)


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = BoltFlasherApp()
    window.show()
    sys.exit(app.exec_())
