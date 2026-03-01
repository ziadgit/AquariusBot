# Finestral

> A mental health indie game that detects burnout through your voice -- not your words -- and responds with physical actions, not paragraphs.

### **[Try the live demo](https://aquariusbot.vercel.app/)** | Built on the Mistral model family for the Mistral SF Hackathon

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Mistral](https://img.shields.io/badge/Mistral-3_models-ff7000) ![Three.js](https://img.shields.io/badge/Three.js-3D-049ef4) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

---

## Why

73% of builders report burnout symptoms ([source](https://www.itpro.com/software/development/burnout-is-now-rife-across-the-software-community-with-almost-half-of-developers-turning-to-self-help-apps)). They cope the way they know how: open another tab, type into another text box, scroll another feed. The intervention is indistinguishable from the problem.

Finestral takes a different route. You talk; the robot listens to *how* you say it -- not just what. When you are stressed, even if you say "I'm fine," it catches frustration underneath and responds the way a good friend would: not with a paragraph, but by doing something -- physically moving, cracking a joke with its whole body, or pumping its fist to cheer you on.

A character that dances to cheer you up can help you break out of a negative spiral.

---

## What Sets This Apart

- **Voice-first emotion detection** -- runs on raw audio waveforms, not transcripts. "I'm fine" said through clenched teeth still registers as `anxious`.
- **Body before text** -- the robot physically reacts before the voice response is synthesized. Embodied response breaks negative spirals faster than words.
- **Therapeutic RAG, not vibes** -- retrieves specific CBT techniques and grounding exercises from a hand-curated wellness knowledge base. No generic "be empathetic" system prompts.
- **Mood arc tracking** -- understands emotional trajectory across the full conversation, not just the current turn.
- **Custom Unity `.anim` parser** -- converts left-handed quaternion animations to Three.js clips in the browser. 15 motion-captured animations mapped to 70+ action keywords.

---

## Mistral Ecosystem

Finestral uses three Mistral models across the perception-reasoning-action pipeline:

| Model | Role in Pipeline |
|---|---|
| **Voxtral Mini** | - Real-time speech-to-text from browser microphone<br>- Audio emotion classification directly from raw waveform -- catches stress that text alone misses |
| **Mistral Small** | - Personality-driven conversational AI with embedded physical action directives<br>- Empathy-augmented responses: therapeutic context and action directives injected via the empathy engine |
| **Mistral 7B + QLoRA** | Fine-tuned empathy adapter trained on 16k emotion-labeled conversations ([`hyan/mistral-empathy-lora`](https://huggingface.co/hyan/mistral-empathy-lora)) -- trained and available as a drop-in replacement for Mistral Small when GPU resources allow |

The critical design choice: **emotion detection runs on the audio signal, not the transcript.** Voxtral Mini receives the raw waveform and classifies tone directly -- so "I'm fine" said through a clenched jaw still registers as `anxious`. Text-only sentiment analysis would miss it entirely.

---

## System Architecture

![AI Companion Platform Architecture](assets/finestral_game_architecture.png)

---

## The Empathy Engine

Not a chatbot with a friendly system prompt. A four-stage pipeline:

### 1. Classify

The engine evaluates each detected emotion against a distress set: `stressed`, `sad`, `angry`, `frustrated`, `anxious`, `confused`. Non-distress emotions (happy, calm, confident, excited) flow through the standard animation pipeline untouched. No unnecessary intervention.

### 2. Retrieve (RAG)

On distress detection, the engine queries a structured therapeutic knowledge base containing:

- **CBT techniques** -- cognitive restructuring, thought challenging, behavioral activation, decatastrophizing
- **Grounding exercises** -- 5-4-3-2-1 sensory grounding, box breathing, body scan
- **Tech-specific strategies** -- burnout recovery, imposter syndrome patterns, deadline anxiety

Each emotion maps to a curated subset. `anxious` retrieves decatastrophizing + 5-4-3-2-1 + box breathing. `frustrated` retrieves thought challenging + deadline anxiety. The mapping is hand-curated from wellness literature, not generated.

### 3. Decide

The engine selects an action sequence calibrated to the specific emotion:

| Emotion | Uplift Strategy | Robot Actions |
|---|---|---|
| Sad | Rally | Fist pump, victory pose |
| Angry | Channel | Fist pump, stand tall |
| Frustrated | Break through | Fist pump, jump |
| Anxious | Reassure | Fist pump, warm wave |
| Confused | Energize | Fist pump, jump |

The first action fires before the voice response is synthesized -- so the user sees a physical reaction while the LLM is still generating.

| ![Wave](assets/wave.gif) | ![Walk](assets/walk.gif) |
|:---:|:---:|
| Wave | Walk |

### 4. Augment

Retrieved techniques, mood trend analysis, and action directives are injected into the system prompt. The LLM doesn't receive a generic "be empathetic" instruction. It receives:

- Specific therapeutic techniques relevant to the detected emotion
- The user's emotional trajectory across the session (improving, worsening, stuck)
- A directive to embed physical actions in `*asterisks*` for the animation parser

The result: responses that reference specific CBT steps, acknowledge mood shifts, and control the robot's body language -- all generated in a single LLM call.

### Emotion Memory

The engine tracks emotion history across the full conversation. `checkMoodTrend()` detects trajectory shifts:

- `stressed → stressed → calm` -- "Positive shift. Things are moving in a good direction."
- `calm → anxious → frustrated` -- "Mood dipped. Worth checking what changed."
- `sad → sad → sad` -- "Consistently sad across the conversation."

This context feeds back into the prompt. Finestral doesn't just react to the current turn. It understands the arc.

---

## Action System

### Robot Action Orchestrator
Selects from 15 motion-captured animations (idle variants, walk, run, jump, wave, dance, celebrate, think, victory pose, and emotion-specific stances). 70+ action keywords parsed from LLM responses map to specific animations with glow colors -- giving the model fine-grained control over body language.

The orchestrator handles two animation channels:
- **Immediate reaction** -- fires on distress detection, before the LLM responds
- **Response-embedded actions** -- parsed from `*asterisks*` in the LLM's reply, executed in sequence

### Cosmic Aquarium
Finestral lives inside a procedurally generated cosmic aquarium with orbiting planets, drifting asteroids, and rising bubbles. The robot's physical actions trigger environmental scatter effects -- planets wobble, bubbles disperse, asteroids drift -- reinforcing the felt connection between expression and world response. When Finestral pumps its fist, the cosmos reacts.

### Planned: Local Event Discovery
When sustained stress is detected (2+ consecutive negative emotions), search for nearby real-world events as concrete, actionable suggestions -- ramen festivals, pop-up markets, outdoor yoga. Specific, actionable, low barrier.

### Planned: Adaptive Game Leveling
Adjust aquarium environmental parameters based on emotional state -- calmer movement when distressed, faster pacing when confident.

---

## How It Works

```
    You speak into the mic
            |
    [Voxtral Mini] ──> Transcript + Emotion (from raw audio waveform)
            |
    [Empathy Engine] ──> Classify ──> Retrieve (CBT/grounding) ──> Decide ──> Augment
            |                                                          |
            |                                           Robot acts before voice
            |                                           response is synthesized
            |
    [Mistral Small] ──> Therapeutic response + embedded action directives
            |
    3D Robot animates in a cosmic aquarium that reacts to its actions
```

---

## Tech Stack

| Function | Layer | Tech |
|---|---|---|
| **Gaming** | Framework | Next.js 16, React 19, TypeScript 5 |
| | 3D | Three.js 0.183, React Three Fiber, React Three Drei |
| | Animation | 15 Unity `.anim` files parsed via custom YAML-to-KeyframeTrack converter |
| | Environment | Procedural cosmic aquarium (instanced mesh, quality tiers) |
| **Voice** | Capture | WebAudio API, WAV encoder (16kHz mono) |
| | Transcription | Voxtral Mini |
| | Emotion detection | Voxtral Mini (multimodal audio classification) |
| | Synthesis | ElevenLabs Turbo v2.5 (emotion-adapted parameters) |
| **Empathy** | Chat | Mistral Small |
| | Empathy engine | Custom classify-retrieve-decide-augment pipeline |
| | Knowledge base | In-memory therapeutic KB (CBT, grounding, tech-stress) |

### Key Files

- `emotion-action-agent.ts` -- Four-stage empathy engine with distress classification, RAG retrieval, action selection, and prompt augmentation
- `empathy-knowledge.ts` -- Therapeutic knowledge base: CBT techniques, grounding exercises, tech-worker stress strategies
- `emotion-mapping.ts` -- 70+ action keywords, 10 emotion animations, 9 command types, response parser
- `Robot3D.tsx` -- FBX model loader, animation mixer, emotion glow, procedural movement paths
- `unity-anim-parser.ts` -- Converts Unity `.anim` YAML (left-handed quaternions) to Three.js clips (right-handed)

---

## Model Fine-Tuning

The empathy dialogue adapter was trained on the [Empathetic Dialogues dataset](https://huggingface.co/datasets/Estwld/empathetic_dialogues_llm) -- 16k conversations with emotion labels spanning 32 categories.

| Parameter | Value |
|---|---|
| Base model | Mistral-7B-Instruct-v0.3 |
| Method | QLoRA (rank 16, alpha 32) |
| Target modules | q, k, v, o attention projections |
| Trainable parameters | 13.6M (0.19% of total) |
| Quantization | 4-bit NF4 with double quantization |
| Training | 1 epoch, lr 2e-4, cosine schedule, warmup |
| Adapter size | ~55 MB |
| Logging | Weights & Biases |

The adapter slots into the pipeline as a drop-in replacement for the Mistral Small endpoint when GPU resources are available -- richer empathetic language without changing any downstream code.

---

## Quickstart

```bash
git clone https://github.com/ziadgit/robochat.git
cd robochat
npm install
```

Create `.env.local`:

```
MISTRAL_API_KEY=your_mistral_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Click the mic. Talk to Finestral.

---

## Team

Built by [Ziad](https://github.com/ziadgit) and [Hannah](https://github.com/yanhann10) at the Mistral SF Hackathon.
