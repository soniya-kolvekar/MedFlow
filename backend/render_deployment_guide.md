# Deploying MedFlow Backend to Render

Follow these steps to host your FastAPI backend on Render.

## 1. Prepare your Repository
Ensure your latest changes are pushed to GitHub (which we just did!). Render will connect to this repository.

## 2. Create a New Web Service
1. Go to [dashboard.render.com](https://dashboard.render.com) and log in.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select the `MedFlow` repository.

## 3. Configure the Service
Set the following values in the Render configuration:

| Setting | Value |
| :--- | :--- |
| **Name** | `medflow-backend` (or your choice) |
| **Region** | Select the one closest to you (e.g., Singapore or Mumbai if available) |
| **Branch** | `master` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |

## 4. Set Environment Variables
Render needs your API keys to function. 

1. Scroll down to the **Environment Variables** section.
2. Click **Add Environment Variable**.
3. Add the following from your `.env` file:
   - `SARVAM_API_KEY`: `your_actual_key_here`
   - `PORT`: `8000` (Render will override this, but it's good practice)

## 5. Deploy
1. Click **Create Web Service**.
2. Render will start building your application. You can watch the logs.
3. Once the status is **Live**, you will get a URL like `https://medflow-backend.onrender.com`.

## 6. Update Frontend
Once your backend is live, you **must** update your frontend's `.env.local`:
1. Open `medflow/.env.local`.
2. Change `NEXT_PUBLIC_API_URL` to your new Render URL (e.g., `https://medflow-backend.onrender.com`).
3. Re-deploy or restart your frontend.

> [!IMPORTANT]
> Render's free tier "spins down" after 15 minutes of inactivity. The first request after a break might take 30-60 seconds to respond as the server "wakes up".
