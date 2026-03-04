/**
 * pattern_engine.js
 * Core execution logic for declarative pattern matching.
 */

(function () {
    const E = window.BaziEngine || (window.BaziEngine = {});

    class PatternEngine {
        constructor() {
            this.patterns = [];
        }

        /**
         * Register a set of patterns (formulas).
         * @param {string} category 
         * @param {Array} patternList 
         */
        registerPatterns(category, patternList) {
            patternList.forEach(p => {
                p.category = category;
                this.patterns.push(p);
            });
        }

        /**
         * Match facts against all registered patterns.
         * @param {Object} facts - The feature object from pattern_extractor.js
         * @returns {Array} - List of matched patterns
         */
        execute(facts) {
            const results = [];

            for (const p of this.patterns) {
                if (this.evaluate(p.conditions, facts)) {
                    let finalNarrative = p.narrative || p.desc || "";

                    // Dynamic Placeholder Replacement
                    // Matches ${variableName} and replaces with facts[variableName]
                    finalNarrative = finalNarrative.replace(/\${(\w+)}/g, (match, key) => {
                        return facts[key] !== undefined ? facts[key] : match;
                    });

                    results.push({
                        id: p.id,
                        category: p.category,
                        title: p.title,
                        path: p.path,
                        desc: finalNarrative,
                        tags: p.tags || []
                    });
                }
            }

            return results;
        }

        /**
         * Evaluate conditions (supports AND, likely simple list for now)
         * @param {Array|Function} conditions 
         * @param {Object} facts 
         */
        evaluate(conditions, facts) {
            if (typeof conditions === 'function') {
                return conditions(facts);
            }

            if (Array.isArray(conditions)) {
                // Default: ALL conditions must be true
                return conditions.every(cond => {
                    if (typeof cond === 'string') {
                        // Handle simple NOT (!) prefix
                        if (cond.startsWith('!')) {
                            return !facts[cond.substring(1)];
                        }
                        return !!facts[cond];
                    }
                    if (typeof cond === 'function') {
                        return cond(facts);
                    }
                    return false;
                });
            }

            return false;
        }
    }

    E.PatternEngine = new PatternEngine();
})();
