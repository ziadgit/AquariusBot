# Finestral

> A mental health indie game that detects burnout through your voice -- not your words -- and responds with physical actions, not paragraphs.

### **[Try the live demo](https://aquariusbot.vercel.app/)** | Built with 5 Mistral models for the Mistral SF Hackathon

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Mistral](https://img.shields.io/badge/Mistral-5_models-ff7000) ![Three.js](https://img.shields.io/badge/Three.js-3D-049ef4) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)

---

## Why

73% of builders report burnout symptoms ([source](https://www.itpro.com/software/development/burnout-is-now-rife-across-the-software-community-with-almost-half-of-developers-turning-to-self-help-apps)). They cope the way they know how: open another tab, type into another text box, scroll another feed. The intervention is indistinguishable from the problem.

Finestral takes a different route. Voice in, body out. You talk; the robot listens to *how* you say it -- not just what. It reads stress in a steady voice that says "I'm fine." It catches frustration buried under polite words. And it responds the way a good friend would: not with a paragraph, but by doing something -- physically moving, cracking a joke with its whole body, or telling you there's a ramen competition happening across town this Saturday.

The insight is simple: embodied response outperforms text. A dancing robot breaks a negative spiral faster than a chatbot paragraph ever could.

---

## What Sets This Apart

- **Voice-first emotion detection** -- runs on raw audio waveforms, not transcripts. "I'm fine" said through clenched teeth still registers as `anxious`.
- **Body before text** -- the robot physically reacts within milliseconds, before the LLM even starts generating. Embodied response breaks negative spirals faster than words.
- **Therapeutic RAG, not vibes** -- retrieves specific CBT techniques and grounding exercises from a hand-curated wellness knowledge base. No generic "be empathetic" system prompts.
- **Mood arc tracking** -- understands emotional trajectory across the full conversation, not just the current turn.
- **Custom Unity `.anim` parser** -- converts left-handed quaternion animations to Three.js clips in the browser. 16 motion-captured animations mapped to 70+ action keywords.

---

## Mistral Ecosystem

Finestral orchestrates five distinct touchpoints across the Mistral model family. Each model handles a specialized stage of the perception-reasoning-action loop:

| Model | Role in Pipeline |
|---|---|
| **Voxtral Mini** | - Real-time speech-to-text from browser microphone<br>- Audio emotion classification directly from raw waveform -- catches stress that text alone misses |
| **Mistral Small** | - Personality-driven conversational AI with embedded physical action directives<br>- Agentic tool orchestration: RAG-augmented empathy agent with tool calling for actions, events, and game state |
| **Mistral 7B + QLoRA** | Fine-tuned empathy specialist -- adapter trained on 16k emotion-labeled conversations ([`hyan/mistral-empathy-lora`](https://huggingface.co/hyan/mistral-empathy-lora)) |

The critical design choice: **emotion detection runs on the audio signal, not the transcript.** Voxtral Mini receives the raw waveform and classifies tone directly -- so "I'm fine" said through a clenched jaw still registers as `anxious`. Text-only sentiment analysis would miss it entirely.

---

## System Architecture

![AI Companion Platform Architecture](assets/finestral_game_architecture.png)

---

## The Empathy Agent

Not a chatbot with a friendly system prompt. A four-stage autonomous pipeline:

### 1. Classify

The agent evaluates each detected emotion against a distress set: `stressed`, `sad`, `angry`, `frustrated`, `anxious`, `confused`. Non-distress emotions (happy, calm, confident, excited) flow through the standard animation pipeline untouched. No unnecessary intervention.

### 2. Retrieve (RAG)

On distress detection, the agent queries a structured therapeutic knowledge base containing:

- **CBT techniques** -- cognitive restructuring, thought challenging, behavioral activation, decatastrophizing
- **Grounding exercises** -- 5-4-3-2-1 sensory grounding, box breathing, progressive relaxation
- **Tech-specific strategies** -- burnout recovery, imposter syndrome patterns, deadline anxiety

Each emotion maps to a curated subset. `anxious` retrieves decatastrophizing + 5-4-3-2-1 + box breathing. `frustrated` retrieves thought challenging + deadline anxiety. The mapping is hand-curated from wellness literature, not generated.

### 3. Decide

The agent selects an action sequence calibrated to the specific emotion:

| Emotion | Uplift Strategy | Robot Actions |
|---|---|---|
| Stressed | Gentle comfort | Warm wave, understanding nod |
| Sad | Cheer up | Celebratory dance, fist pump |
| Frustrated | Playful distraction | Bouncing, goofy spin |
| Anxious | Gentle comfort | Warm wave, calm idle |
| Confused | Energize | Jump, victory pose |

The first action fires **immediately** -- before the LLM response arrives -- so the user sees a physical reaction within milliseconds of speaking.

### 4. Augment

Retrieved techniques, mood trend analysis, and action directives are injected into the system prompt. The LLM doesn't receive a generic "be empathetic" instruction. It receives:

- Specific therapeutic techniques relevant to the detected emotion
- The user's emotional trajectory across the session (improving, worsening, stuck)
- A directive to embed physical actions in `*asterisks*` for the animation parser

The result: responses that reference specific CBT steps, acknowledge mood shifts, and control the robot's body language -- all generated in a single LLM call.

### Emotion Memory

The agent tracks emotion history across the full conversation. `checkMoodTrend()` detects trajectory shifts:

- `stressed → stressed → calm` -- "Positive shift. Things are moving in a good direction."
- `calm → anxious → frustrated` -- "Mood dipped. Worth checking what changed."
- `sad → sad → sad` -- "Consistently sad across the conversation."

This context feeds back into the prompt. Finestral doesn't just react to the current turn. It understands the arc.

---

## Agent Tools

The emotion-action agent operates through a tool-calling architecture. Each tool is a specialized capability the agent invokes based on emotional context and session state:

### Robot Action Orchestrator
Selects from 16 motion-captured animations (idle variants, walk, run, jump, wave, dance, celebrate, think, victory pose, and emotion-specific stances). 70+ action keywords parsed from LLM responses map to specific animations with glow colors -- giving the model fine-grained control over body language.

The orchestrator handles two animation channels:
- **Immediate reaction** -- fires on distress detection, before the LLM responds
- **Response-embedded actions** -- parsed from `*asterisks*` in the LLM's reply, executed in sequence

### Local Event Discovery
When the agent detects sustained stress (2+ consecutive negative emotions), it searches for nearby real-world events as concrete, actionable suggestions:

```
Agent detects: stressed → stressed → frustrated

Tool call: search_local_events(
  mood = "needs_distraction",
  categories = ["food", "outdoor", "social"],
  max_effort = "low"       // nothing that requires planning
)

→ "Ramen Competition at Fort Mason — this Saturday, free entry"
→ "Matcha Festival in Japantown — free tastings until 5pm"
→ "Sunset yoga at Dolores Park — starts in 2 hours"
```

The agent doesn't say "maybe try going outside." It says "there's a matcha festival in Japantown right now." Specific. Actionable. Low barrier.

### Adaptive Game Leveling
Finestral lives inside a procedurally generated cosmic aquarium with interactive elements -- orbiting planets, drifting asteroids, rising bubbles. The game leveling tool adjusts environmental parameters based on emotional state:

| Emotional State | Environment Response | Design Intent |
|---|---|---|
| Distressed | Calmer movement, fewer obstacles, forgiving collision | The point is agency, not challenge |
| Neutral | Standard pacing, light engagement | Maintain presence without pressure |
| Confident / Excited | Faster movement, tighter timing, bonus objectives | Channel the energy productively |

The robot's physical actions trigger environmental scatter effects -- planets wobble, bubbles disperse, asteroids drift -- reinforcing the felt connection between expression and world response. When Finestral dances, the cosmos dances with it.

---

## How It Works

```
    You speak into the mic
            |
    [Voxtral Mini] ──> Transcript + Emotion (from raw audio waveform)
            |
    [Empathy Agent] ──> Classify ──> Retrieve (CBT/grounding) ──> Decide ──> Augment
            |                                                         |
            |                                          Robot acts IMMEDIATELY
            |                                          (before LLM responds)
            |
    [Mistral Small] ──> Therapeutic response + embedded action directives
            |
    3D Robot animates in a cosmic aquarium that reacts to your mood
```

---

## Tech Stack

| Function | Layer | Tech |
|---|---|---|
| **Gaming** | Framework | Next.js 16, React 19, TypeScript 5 |
| | 3D | Three.js 0.183, React Three Fiber, React Three Drei |
| | Animation | 16 Unity `.anim` files parsed via custom YAML-to-KeyframeTrack converter |
| | Environment | Procedural cosmic aquarium (instanced mesh, quality tiers) |
| **Voice** | Capture | WebAudio API, WAV encoder (16kHz mono) |
| | Transcription | Voxtral Mini |
| | Emotion detection | Voxtral Mini (multimodal audio classification) |
| | Synthesis | ElevenLabs Turbo v2.5 (emotion-adapted parameters) |
| **Agentic** | Chat | Mistral Small |
| | Empathy agent | Custom classify-retrieve-decide-augment pipeline |
| | Knowledge base | In-memory therapeutic KB (CBT, grounding, tech-stress) |

### Key Files

- `emotion-action-agent.ts` -- Four-stage empathy agent with distress classification, RAG retrieval, action selection, and prompt augmentation
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
