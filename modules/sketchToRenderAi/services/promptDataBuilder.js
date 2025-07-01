import { helpers } from '../../../utils/index.js';

export default (contactId, query, imageName = '', COMFY_FILE_BASE_PATH) => (
    {
        "client_id": contactId,
        "prompt": {
            "1": {
              "inputs": {
                "text": `${COMFY_FILE_BASE_PATH}/sketch-to-render-ai/${imageName}`
              },
              "class_type": "> Text",
              "_meta": {
                "title": "path to image"
              }
            },
            "2": {
              "inputs": {
                "path": [
                  "1",
                  0
                ]
              },
              "class_type": "JWImageLoadRGBA",
              "_meta": {
                "title": "Image Load RGBA"
              }
            },
            "3": {
              "inputs": {
                "images": [
                  "18",
                  0
                ]
              },
              "class_type": "PreviewImage",
              "_meta": {
                "title": "Preview Image"
              }
            },
            "4": {
              "inputs": {
                "ckpt_name": "epicphotogasm_z.safetensors"
              },
              "class_type": "CheckpointLoaderSimple",
              "_meta": {
                "title": "Load Checkpoint"
              }
            },
            "5": {
              "inputs": {
                "strength": 1.0000000000000002,
                "start_percent": 0,
                "end_percent": 1,
                "positive": [
                  "7",
                  0
                ],
                "negative": [
                  "8",
                  0
                ],
                "control_net": [
                  "6",
                  0
                ],
                "image": [
                  "17",
                  0
                ],
                "vae": [
                  "4",
                  2
                ]
              },
              "class_type": "ControlNetApplyAdvanced",
              "_meta": {
                "title": "Apply ControlNet"
              }
            },
            "6": {
              "inputs": {
                "control_net_name": "1.5\\control_v11p_sd15_scribble.pth"
              },
              "class_type": "ControlNetLoader",
              "_meta": {
                "title": "Load ControlNet Model"
              }
            },
            "7": {
              "inputs": {
                "text": query,
                "clip": [
                  "4",
                  1
                ]
              },
              "class_type": "CLIPTextEncode",
              "_meta": {
                "title": "CLIP Text Encode (Prompt)"
              }
            },
            "8": {
              "inputs": {
                "text": "dirt, vray, corona render, 3d rendering, low quality, cgi, cartoon, digital rendering",
                "clip": [
                  "4",
                  1
                ]
              },
              "class_type": "CLIPTextEncode",
              "_meta": {
                "title": "CLIP Text Encode (Prompt)"
              }
            },
            "9": {
              "inputs": {
                "width": [
                  "17",
                  1
                ],
                "height": [
                  "17",
                  2
                ],
                "batch_size": 1
              },
              "class_type": "EmptyLatentImage",
              "_meta": {
                "title": "Empty Latent Image"
              }
            },
            "10": {
              "inputs": {
                "noise": [
                  "13",
                  0
                ],
                "guider": [
                  "11",
                  0
                ],
                "sampler": [
                  "21",
                  0
                ],
                "sigmas": [
                  "12",
                  0
                ],
                "latent_image": [
                  "9",
                  0
                ]
              },
              "class_type": "SamplerCustomAdvanced",
              "_meta": {
                "title": "SamplerCustomAdvanced"
              }
            },
            "11": {
              "inputs": {
                "cfg": 6,
                "model": [
                  "4",
                  0
                ],
                "positive": [
                  "5",
                  0
                ],
                "negative": [
                  "5",
                  1
                ]
              },
              "class_type": "CFGGuider",
              "_meta": {
                "title": "CFGGuider"
              }
            },
            "12": {
              "inputs": {
                "model_type": "SD1",
                "steps": 20,
                "denoise": 1
              },
              "class_type": "AlignYourStepsScheduler",
              "_meta": {
                "title": "AlignYourStepsScheduler"
              }
            },
            "13": {
              "inputs": {
                "noise_seed": helpers.generateRandomNumbers(15)
              },
              "class_type": "RandomNoise",
              "_meta": {
                "title": "RandomNoise"
              }
            },
            "14": {
              "inputs": {
                "scheduler": "karras",
                "steps": 30,
                "denoise": 1,
                "model": [
                  "4",
                  0
                ]
              },
              "class_type": "BasicScheduler",
              "_meta": {
                "title": "BasicScheduler"
              }
            },
            "17": {
              "inputs": {
                "width": 1024,
                "height": 1024,
                "upscale_method": "nearest-exact",
                "keep_proportion": "resize",
                "pad_color": "0, 0, 0",
                "crop_position": "center",
                "divisible_by": 1,
                "device": "cpu",
                "image": [
                  "2",
                  0
                ]
              },
              "class_type": "ImageResizeKJv2",
              "_meta": {
                "title": "Resize Image v2"
              }
            },
            "18": {
              "inputs": {
                "samples": [
                  "10",
                  0
                ],
                "vae": [
                  "4",
                  2
                ]
              },
              "class_type": "VAEDecode",
              "_meta": {
                "title": "VAE Decode"
              }
            },
            "21": {
              "inputs": {
                "sampler_name": "euler"
              },
              "class_type": "KSamplerSelect",
              "_meta": {
                "title": "KSamplerSelect"
              }
            }
        }
    }
);

