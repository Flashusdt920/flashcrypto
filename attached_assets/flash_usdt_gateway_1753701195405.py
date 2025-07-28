import tkinter as tk
from tkinter import ttk, messagebox
import webbrowser
import tkinter as tk
from tkinter import simpledialog, messagebox

def login_screen():
    login_root = tk.Tk()
    login_root.withdraw()
    username = simpledialog.askstring("Login", "Enter Username:")
    password = simpledialog.askstring("Login", "Enter Password:", show='*')

    if username != "admin" or password != "usdt123":
        messagebox.showerror("Login Failed", "Invalid credentials!")
        exit()
    login_root.destroy()

login_screen()


APP_TITLE = "🚀 FLASH USDT GATEWAY"
TELEGRAM_LINK = "https://t.me/primasoftwares"
COPYRIGHT = "© 2025 primasoftwares. All rights reserved."
SIMULATED_BALANCE = "$5,000,000.00"
WALLETS = ["Wallet 1", "Wallet 2"]

def open_telegram():
    webbrowser.open(TELEGRAM_LINK)

def send_transaction():
    messagebox.showinfo("Transaction", "Flash transaction sent successfully!")

def view_logs():
    messagebox.showinfo("Logs", "No logs found yet.")

root = tk.Tk()
root.title(APP_TITLE)
root.geometry("700x500")
root.configure(bg="#1e1e1e")

root.after(500, open_telegram)

wallet_frame = tk.Frame(root, bg="#1e1e1e")
wallet_frame.pack(pady=10)

tk.Label(wallet_frame, text="Select Wallet:", bg="#1e1e1e", fg="white").pack(side="left", padx=5)
wallet_var = tk.StringVar(value=WALLETS[0])
ttk.Combobox(wallet_frame, textvariable=wallet_var, values=WALLETS, state="readonly").pack(side="left")

tab_control = ttk.Notebook(root)
style = ttk.Style()
style.theme_use('default')
style.configure('TNotebook', background='#2e2e2e', borderwidth=0)
style.configure('TNotebook.Tab', background='#333', foreground='white', padding=[10, 5])
style.map('TNotebook.Tab', background=[('selected', '#222')])

def create_chain_tab(name):
    frame = tk.Frame(tab_control, bg="#1e1e1e")
    tk.Label(frame, text=f"{name} Flash Interface", font=("Segoe UI", 12), fg="white", bg="#1e1e1e").pack(pady=10)

    tk.Label(frame, text="Wallet Address:", fg="white", bg="#1e1e1e").pack()
    tk.Entry(frame, width=50).pack(pady=5)

    tk.Label(frame, text="Network:", fg="white", bg="#1e1e1e").pack()
    ttk.Combobox(frame, values=["Bitcoin Testnet", "Ethereum Goerli", "BSC Testnet", "Tron Nile"], state="readonly").pack(pady=5)

    tk.Label(frame, text="Token:", fg="white", bg="#1e1e1e").pack()
    ttk.Combobox(frame, values=["USDT"], state="readonly").pack(pady=5)

    tk.Label(frame, text=f"Balance: {SIMULATED_BALANCE}", fg="#00ff99", bg="#1e1e1e", font=("Segoe UI", 16)).pack(pady=10)

    tk.Button(frame, text="Send Flash Transaction", command=send_transaction).pack(pady=5)
    tk.Button(frame, text="View Transaction Logs", command=view_logs).pack(pady=5)

    return frame

tab_control.add(create_chain_tab("TRC20"), text="TRC20")
tab_control.add(create_chain_tab("ERC20"), text="ERC20")
tab_control.add(create_chain_tab("BEP20"), text="BEP20")
tab_control.pack(expand=1, fill='both')

footer = tk.Frame(root, bg="#1e1e1e")
footer.pack(side="bottom", fill="x", pady=10)

dark_mode_label = tk.Label(footer, text="▣ Dark Mode: ON", bg="#1e1e1e", fg="#888")
dark_mode_label.pack(side="left", padx=20)

telegram_link = tk.Label(footer, text="🔗 Telegram (primasoftwares)", fg="skyblue", bg="#1e1e1e", cursor="hand2")
telegram_link.pack(side="left")
telegram_link.bind("<Button-1>", lambda e: open_telegram())

copyright_label = tk.Label(
    footer, text=COPYRIGHT, bg="#1e1e1e", fg="#555", font=("Segoe UI", 8)
)
copyright_label.pack(side="right", padx=20)

root.mainloop()