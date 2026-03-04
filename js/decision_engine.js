/**
 * decision_engine.js
 * A generic engine to execute decision trees based on Bazi data.
 */

window.DecisionEngine = (function () {

    class Node {
        constructor(id, text, type = 'condition') {
            this.id = id;
            this.text = text; // Description of this step
            this.type = type; // 'condition' or 'result'
            this.yesNode = null;
            this.noNode = null;
            this.children = []; // For multi-branch if needed, but binary is easier for now
            this.data = {}; // Extra metadata like 'score', 'tags'
        }

        // Binary logic setup
        yes(node) {
            this.yesNode = node;
            return this;
        }

        no(node) {
            this.noNode = node;
            return this;
        }

        // Functional check
        setCondition(fn) {
            this.conditionFn = fn;
            return this;
        }
    }

    class Engine {
        constructor() {
            this.roots = {};
        }

        registerTree(name, rootNode) {
            this.roots[name] = rootNode;
        }

        execute(treeName, context) {
            const root = this.roots[treeName];
            if (!root) return null;

            const trace = [];
            let currentNode = root;
            const results = []; // Changed to array

            while (currentNode) {
                // Record the step
                const step = {
                    id: currentNode.id,
                    text: currentNode.text,
                    type: currentNode.type
                };

                if (currentNode.type === 'result') {
                    // Record result data and capture current trace snapshot
                    const resultData = { ...currentNode.data };
                    resultData._trace = [...trace, step];
                    results.push(resultData);

                    step.result = currentNode.data;
                    step.decision = true;
                    trace.push(step);

                    // Continue if there is a 'yesNode' (Next Step) defined
                    // This allows chaining: Result A -> Check B -> Result B
                    currentNode = currentNode.yesNode;
                    continue;
                }

                // Execute Condition
                let decision = false;
                try {
                    if (currentNode.conditionFn) {
                        decision = currentNode.conditionFn(context);
                    }
                } catch (e) {
                    console.error(`Error in node ${currentNode.id}:`, e);
                    step.error = e.message;
                }

                step.decision = decision;
                trace.push(step);

                // Move to next
                if (decision) {
                    currentNode = currentNode.yesNode;
                } else {
                    currentNode = currentNode.noNode;
                }
            }

            return {
                treeName,
                results: results, // Return array
                trace: trace
            };
        }
    }

    // Builder helper
    function createNode(id, text) {
        return new Node(id, text);
    }

    function createResult(id, text, data) {
        const n = new Node(id, text, 'result');
        n.data = data || {};
        if (!n.data.id) n.data.id = id;
        if (!n.data.title) n.data.title = text; // Ensure title exists for Narrative engine
        if (!n.data.desc) n.data.desc = text;
        return n;
    }

    const instance = new Engine();

    return {
        Engine: instance,
        execute: (name, ctx) => instance.execute(name, ctx),
        registerTree: (name, root) => instance.registerTree(name, root),
        createNode,
        createResult,
        // lookupAcademicResult remains attached dynamically by rules/academic_tree.js
    };

})();
