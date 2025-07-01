import { helpers } from '../../../utils/index.js';

export default (contactId, query, firstImageName = '', secondImageName = '', COMFY_FILE_BASE_PATH) => (
  {
    "client_id": contactId,
    "prompt": {
      "3": {
        "inputs": {
          "seed": helpers.generateRandomNumbers(15),
          "steps": 20,
          "cfg": 6,
          "sampler_name": "euler_ancestral",
          "scheduler": "simple",
          "denoise": 1,
          "model": [
            "18",
            0
          ],
          "positive": [
            "17",
            0
          ],
          "negative": [
            "17",
            1
          ],
          "latent_image": [
            "134",
            0
          ]
        },
        "class_type": "KSampler",
        "_meta": {
          "title": "KSampler"
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
      "6": {
        "inputs": {
          "text": [
            "139",
            0
          ],
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
      "7": {
        "inputs": {
          "text": "",
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
          "samples": [
            "3",
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
      "13": {
        "inputs": {
          "preset": "VIT-G (medium strength)",
          "model": [
            "4",
            0
          ]
        },
        "class_type": "IPAdapterUnifiedLoader",
        "_meta": {
          "title": "IPAdapter Unified Loader"
        }
      },
      "15": {
        "inputs": {
          "control_net_name": "control_v11f1p_sd15_depth.pth"
        },
        "class_type": "ControlNetLoader",
        "_meta": {
          "title": "Load ControlNet Model"
        }
      },
      "17": {
        "inputs": {
          "strength": 0.5000000000000001,
          "start_percent": 0,
          "end_percent": 0.8000000000000002,
          "positive": [
            "6",
            0
          ],
          "negative": [
            "7",
            0
          ],
          "control_net": [
            "15",
            0
          ],
          "image": [
            "135",
            0
          ]
        },
        "class_type": "ControlNetApplyAdvanced",
        "_meta": {
          "title": "Apply ControlNet"
        }
      },
      "18": {
        "inputs": {
          "weight": 1.0000000000000002,
          "weight_type": "style transfer",
          "combine_embeds": "add",
          "start_at": 0,
          "end_at": 0.9720000000000002,
          "embeds_scaling": "K+mean(V) w/ C penalty",
          "model": [
            "13",
            0
          ],
          "ipadapter": [
            "13",
            1
          ],
          "image": [
            "140",
            0
          ],
          "clip_vision": [
            "19",
            0
          ]
        },
        "class_type": "IPAdapterAdvanced",
        "_meta": {
          "title": "IPAdapter Advanced"
        }
      },
      "19": {
        "inputs": {
          "clip_name": "CLIP-ViT-bigG-14-laion2B-39B-b160k.safetensors"
        },
        "class_type": "CLIPVisionLoader",
        "_meta": {
          "title": "Load CLIP Vision"
        }
      },
      "55": {
        "inputs": {
          "model_name": "sam2_hiera_base_plus.pt"
        },
        "class_type": "SAM2ModelLoader (segment anything2)",
        "_meta": {
          "title": "SAM2ModelLoader (segment anything2)"
        }
      },
      "56": {
        "inputs": {
          "prompt": "cabinets, crown",
          "threshold": 0.10000000000000002,
          "sam_model": [
            "55",
            0
          ],
          "grounding_dino_model": [
            "57",
            0
          ],
          "image": [
            "75",
            0
          ]
        },
        "class_type": "GroundingDinoSAM2Segment (segment anything2)",
        "_meta": {
          "title": "GroundingDinoSAM2Segment (segment anything2)"
        }
      },
      "57": {
        "inputs": {
          "model_name": "GroundingDINO_SwinT_OGC (694MB)"
        },
        "class_type": "GroundingDinoModelLoader (segment anything2)",
        "_meta": {
          "title": "GroundingDinoModelLoader (segment anything2)"
        }
      },
      "75": {
        "inputs": {
          "width": 0,
          "height": 768,
          "upscale_method": "bilinear",
          "keep_proportion": "resize",
          "pad_color": "0, 0, 0",
          "crop_position": "center",
          "divisible_by": 8,
          "device": "cpu",
          "image": [
            "141",
            0
          ]
        },
        "class_type": "ImageResizeKJv2",
        "_meta": {
          "title": "Resize Image v2"
        }
      },
      "80": {
        "inputs": {
          "prompt": "fridge, hood, range",
          "threshold": 0.30000000000000004,
          "sam_model": [
            "55",
            0
          ],
          "grounding_dino_model": [
            "57",
            0
          ],
          "image": [
            "75",
            0
          ]
        },
        "class_type": "GroundingDinoSAM2Segment (segment anything2)",
        "_meta": {
          "title": "GroundingDinoSAM2Segment (segment anything2)"
        }
      },
      "133": {
        "inputs": {
          "images": [
            "8",
            0
          ]
        },
        "class_type": "PreviewImage",
        "_meta": {
          "title": "Preview Image"
        }
      },
      "134": {
        "inputs": {
          "pixels": [
            "75",
            0
          ],
          "vae": [
            "4",
            2
          ]
        },
        "class_type": "VAEEncode",
        "_meta": {
          "title": "VAE Encode"
        }
      },
      "135": {
        "inputs": {
          "preprocessor": "DepthAnythingV2Preprocessor",
          "resolution": 1024,
          "image": [
            "75",
            0
          ]
        },
        "class_type": "AIO_Preprocessor",
        "_meta": {
          "title": "AIO Aux Preprocessor"
        }
      },
      "139": {
        "inputs": {
          "value": "kitchen"
        },
        "class_type": "PrimitiveString",
        "_meta": {
          "title": "image description"
        }
      },
      "140": {
        "inputs": {
          "image": "kitchen_type.jpg"
        },
        "class_type": "LoadImage",
        "_meta": {
          "title": "good room"
        }
      },
      "141": {
        "inputs": {
          "image": "old_kitchen.jpg"
        },
        "class_type": "LoadImage",
        "_meta": {
          "title": "bad room"
        }
      }
    }
  }
);

