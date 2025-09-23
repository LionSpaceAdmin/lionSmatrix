"use client";

import { useState, useEffect, useRef } from 'react';
import { callGeminiWithBackoff } from '@/lib/api';
import { Chart } from 'chart.js/auto';

export default function InfluenceMapperTab() {
  const [target, setTarget] = useState('');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const handleTraceInfluence = async () => {
    if (!target || !topic) {
        alert("Please enter both a target entity and a topic.");
        return;
    }
    setIsLoading(true);
    const userPrompt = `Map the influence network for the target "${target}" regarding the topic "${topic}".`;
    const systemPrompt = `You are a network intelligence analyst. Using Google Search, identify key entities connected to the target entity regarding the specified topic. Trace how the narrative propagates. Return a JSON object representing the network graph.`;

    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
        tools: [{ "google_search": {} }],
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    "nodes": {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                "id": { "type": "STRING" },
                                "label": { "type": "STRING" },
                                "group": { "type": "STRING", "enum": ["Source", "Amplifier", "Media", "Official", "Other"] },
                                "influenceScore": { "type": "NUMBER" }
                            },
                            required: ["id", "label", "group", "influenceScore"]
                        }
                    },
                    "links": {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                "source": { "type": "STRING" },
                                "target": { "type": "STRING" }
                            },
                             required: ["source", "target"]
                        }
                    }
                }
            }
        },
        systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    try {
        const result = await callGeminiWithBackoff(payload);
        const candidate = result.candidates?.[0];
        if (candidate && candidate.content?.parts?.[0]?.text) {
            const graphData = JSON.parse(candidate.content.parts[0].text);
            renderDynamicNetworkChart(graphData);
        } else {
            throw new Error("Invalid response from server for influence mapping.");
        }
    } catch (error) {
        console.error("Influence mapping error:", error);
        alert("Failed to generate the influence map. The model may have returned an invalid structure.");
    } finally {
        setIsLoading(false);
    }
  };

  const renderDynamicNetworkChart = (graphData: any) => {
    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartInstance.current) {
        chartInstance.current.destroy();
    }

    const groupColors = {
        'Source': 'rgba(255, 99, 132, 0.8)', // Red
        'Amplifier': 'rgba(255, 206, 86, 0.8)', // Yellow
        'Media': 'rgba(54, 162, 235, 0.8)', // Blue
        'Official': 'rgba(75, 192, 192, 0.8)', // Green
        'Other': 'rgba(153, 102, 255, 0.8)' // Purple
    };

    const datasets = graphData.nodes.map((node: any) => {
        return {
            label: node.label,
            data: [{
                x: Math.random() * 10,
                y: Math.random() * 10,
                r: 5 + (node.influenceScore || 5)
            }],
            backgroundColor: groupColors[node.group as keyof typeof groupColors] || groupColors['Other']
        };
    });

    chartInstance.current = new Chart(ctx, {
        type: 'bubble',
        data: { datasets: datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context: any) {
                            const node = graphData.nodes.find((n: any) => n.label === context.dataset.label);
                            return `${node.label} (Group: ${node.group}, Influence: ${node.influenceScore})`;
                        }
                    }
                }
            },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
  }

  return (
    <div id="influence-mapper-content" className="tab-content">
        <h2 data-i18n-key="influence_mapper_title" className="font-headline text-3xl text-center mb-2 text-[#B8FFF2]">Dynamic Influence Mapper</h2>
        <p data-i18n-key="influence_mapper_subtitle" className="text-center text-gray-400 mb-6">Enter a target and a topic to map their influence network in real-time.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" id="mapper-target-input" className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="influence_mapper_placeholder_target" placeholder="Target Entity (e.g., The Grayzone)" value={target} onChange={(e) => setTarget(e.target.value)} />
            <input type="text" id="mapper-topic-input" className="w-full p-3 bg-[#0E0E10] border border-gray-700 rounded-md text-white font-body focus:ring-2 focus:ring-[#B8FFF2] focus:outline-none" data-i18n-key="influence_mapper_placeholder_topic" placeholder="Topic/Narrative (e.g., Syria conflict)" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </div>
        <div className="flex justify-center mt-4">
            <button id="trace-influence-button" className="gemini-button text-lg text-[#B8FFF2] py-3 px-10 rounded-md" data-i18n-key="influence_mapper_button" onClick={handleTraceInfluence} disabled={isLoading}>
                {isLoading ? 'Tracing...' : 'Trace Influence Network'}
            </button>
        </div>
        <div className="chart-container mt-6">
            <canvas ref={chartRef}></canvas>
        </div>
    </div>
  );
}
