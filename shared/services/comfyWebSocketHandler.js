import WebSocket from 'ws';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export class ComfyWebSocketHandler {
    constructor(promptDataBuilder) {
        this.promptDataBuilder = promptDataBuilder;

        this.ws = null;
        this.sid = null;
        this.images = [];
        this.isReconnected = false;
        this.connectingPromise = null;

        this.setupWebSocket();
    }

    createWebSocketUrl() {
        return this.sid
            ? `${process.env.COMFY_WS_URL}?clientId=${this.sid}`
            : process.env.COMFY_WS_URL;
    }

    setupWebSocket() {
        if (this.connectingPromise) return this.connectingPromise;

        this.connectingPromise = new Promise((resolve, reject) => {
            this.ws = new WebSocket(this.createWebSocketUrl());

            this.ws.on('open', () => {
                console.log('[WebSocket] Connected');
                if (this.isReconnected) {
                    console.log('[WebSocket] Reconnected with SID:', this.sid);
                    this.isReconnected = false;
                }
            });

            this.ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);

                    if (message.data?.sid && !this.sid) {
                        this.sid = message.data.sid;
                        console.log('[WebSocket] Received SID:', this.sid);
                        resolve(this.sid);
                    }

                    if (message.type === 'executed' && message.data?.output?.images) {
                        const imgs = message.data.output.images.map(img => ({
                            filename: img.filename,
                            subfolder: img.subfolder,
                            type: img.type,
                        }));
                        this.images.push(...imgs);
                        console.log('[WebSocket] Received images:', imgs);
                    }
                } catch (err) {
                    console.error('[WebSocket] Message parse error:', err);
                }
            });

            this.ws.on('error', (err) => {
                console.error('[WebSocket] Error:', err);
                reject(err);
            });

            this.ws.on('close', () => {
                console.log('[WebSocket] Closed. Reconnecting...');
                this.isReconnected = true;
                setTimeout(() => this.setupWebSocket(), 1000);
            });
        });

        return this.connectingPromise;
    }

    /**
     * Sends a prompt with one or multiple image filenames.
     * @param {string} query - prompt text
     * @param {string|object|null} imageFilenames - either a string (single filename) or an object with filenames (e.g., {firstImageName, secondImageName})
     */
    async sendPrompt(query, imageFilenames = null) {
        const sid = await this.setupWebSocket();

        // Prepare parameters to log
        const params = {
            contactId: sid,
            query,
            imageFilenames,
        };

        console.log('[Prompt] Sending:', params);

        try {
            let data;

            if (typeof imageFilenames === 'string' || imageFilenames === null) {
                // single image filename (string or null)
                data = this.promptDataBuilder(sid, query, imageFilenames, process.env.COMFY_FILE_BASE_PATH);
            } else if (typeof imageFilenames === 'object') {
                // multiple image filenames passed as object
                data = this.promptDataBuilder(
                    sid,
                    query,
                    imageFilenames.firstImageName,
                    imageFilenames.secondImageName,
                    process.env.COMFY_FILE_BASE_PATH
                );
            } else {
                throw new Error('Invalid imageFilenames argument');
            }

            const response = await axios.post(process.env.COMFY_SEND_PROMPT_URL, data, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('[Prompt] Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error posting prompt:', error.response?.data || error.message);
            throw error;
        }
    }

    async getLastImage(timeout = 10000) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (this.images.length > 0) {
                    clearInterval(interval);
                    clearTimeout(timer);
                    resolve(this.images[this.images.length - 1]);
                }
            }, 500);

            const timer = setTimeout(() => {
                clearInterval(interval);
                reject('Timeout waiting for image');
            }, timeout);
        });
    }

    async getImage() {
        if (this.images.length === 0) {
            console.log('[Image Fetch] No images available');
            return null;
        }
    
        const image = this.images[this.images.length - 1];
    
        const imageUrl = `${process.env.COMFY_VIEW_IMAGE_URL}?filename=${image.filename}&subfolder=${image.subfolder}&type=${image.type}`;
    
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
            });
    
            return Buffer.from(response.data);
        } catch (error) {
            console.error('[Image Fetch] Error fetching image:', error);
            return null;
        }
    }

    resetImages() {
        this.images = [];
    }

    getSid() {
        return this.sid;
    }
}
