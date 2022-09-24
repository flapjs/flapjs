// eslint-disable-next-line no-unused-vars
import CFG, { Rule } from '../CFG.js';
import { EMPTY } from '@flapjs/deprecated/modules/re/machine/RE.js';

/**
 * Convert a CFG into Chomksy normal form.
<p>
Chomsky normal form is especially useful in CFG related algorithms. A
CFG is in Chomsky normal form if it satisfy the following criteria:
Every rule is of the form:
A -> BC
A -> a
where B and C are any variables except the start variable, and a is any termial.
Furthermore, the only rule that has epsilon on RHS is S -> epsilon where S is
the start variable.
</p>.
 *
 * @param cfg
 * @param {CFG} CFG the context free grammar to convert.
 * @returns {CFG} a CFG in Chomsky normal form that is equivalent to the parameter.
 */
export function convertCFGtoChomsky(cfg) 
{
    /**
     * We break down the conversion procedure into four steps:
     * 1. Create a new start variable
     * 2. Eliminate all the epsilon rules
     * 3. Eliminate all the unit rules
     * 4. Final clean up.
     * 
     * We will build a method for each of the four steps.
     */
    let newCFG = new CFG();
    newCFG.copyFromCFG(cfg);
    // let seperatedCFG = newCFG.separateRulesBySubstitutions();
    let CFGwithNewStartVariable = newStartVariable(newCFG);
    let CFGwithNoEpsilonRules = eliminateEpsilonRules(CFGwithNewStartVariable);
    let CFGwithNoUnitRules = eliminateUnitRules(CFGwithNoEpsilonRules);
    let ChomksyNormalForm = convertRulesIntoProperForm(CFGwithNoUnitRules);    
    return ChomksyNormalForm;
}

/***************************************************************************
 *                                                                         * 
 *                                                                         *
 *                   Step One: add new start Variable                      *
 *                                                                         *
 *                                                                         *
 ***************************************************************************/

/**
 * Step one in the conversion of a CFG to its Chomsky normal form. Set a
new start variable so a start variable will never appear on RHS of a rule.
Note that this function does not change it's parameter, it creates a
new copy in which changes are made.
 *
 * @param {CFG} cfg The CFG to be processed.
 * @returns {CFG} The CFG after setting a new start variable.
 */
export function newStartVariable(cfg) 
{
    // TODO: Notify user that they can't name start variable as 'S_New'
    let newCFG = new CFG();
    newCFG.copyFromCFG(cfg);

    newCFG.addRule(new Rule('S_New', cfg.getStartVariable()));
    newCFG.setStartVariable('S_New');
    return newCFG;
}

/***************************************************************************
 *                                                                         * 
 *                                                                         *
 *                Step Two: eliminate all epsilon rules                    *
 *                          i.e. rules of the form:                        *
 *                          A -> epsilon                                   *
 *                                                                         *
 *                                                                         *
 ***************************************************************************/

/**
 * Step two in the conversion of a CFG to its Chomsky normal form. This step
eliminate all the epsilon rules in the CFG, and add new Rules for every
eliminated rules. This can potentially lead to exponential explosion.
Note: this function is pure, it does not change the argument, but instead
return a new CFG which has the changes.
 *
 * @param cfg
 * @param {CFG} CFG The CFG to be processed.
 * @returns {CFG} An equivalent CFG free of any epsilon rules.
 */
export function eliminateEpsilonRules(cfg) 
{
    // copy construct a new CFG
    let newCFG = new CFG();
    newCFG.copyFromCFG(cfg);
    let variablesEliminated = newCFG._rules.reduce((acc, cur) => 
    {
        acc[cur.getLHS()] = false;
        return acc;
    }, Object.create(null)); // to prevent working on eliminated variable again

    // loop through newCFG._Rules to remove epsilon rules
    let rule = newCFG.findEpsilonRule();
    while(rule) 
    {
        // console.log('Now we are processing ' + rule + ' of CFG: ' + newCFG._rules);
        newCFG.removeRule(rule); 

        if (!variablesEliminated[rule.getLHS()]) 
        {
            let pureEpsilonRule = removePureEpsilonRule(newCFG, rule);
            if (pureEpsilonRule) 
            {
                variablesEliminated[rule.getLHS()] = true; // mark it as processed
                rule = newCFG.findEpsilonRule();
                continue;
            }

            for (const otherRule of newCFG._rules) 
            {
                let rulesToAdd = eliminateEpsilonVariable(otherRule, rule.getLHS(),
                    variablesEliminated[otherRule.getLHS()]);
                newCFG._rules = newCFG._rules.concat(rulesToAdd);
                // do a clean up at this point to remove duplicate rules
                newCFG.cleanUp();
            }
            variablesEliminated[rule.getLHS()] = true; // mark it as processed
        }
        // if the epsilon rule was processed before, we don't do anything and proceed to find the next epsilon rule
        rule = newCFG.findEpsilonRule();
    }
    // finally, remove epsilon from the set of terminals
    newCFG._terminals.delete(EMPTY);
    return newCFG;
}

/**
 * Remove each occurrence of variable from rule. For example, if
 * the rule is A -> bAbAb, and we want to remove A, then we would
 * have three new rules, together with A -> bAbAb, i.e. we have:
 *             A -> bAbAb | bbb | bbAb | bAbb 
 * In general, if a variable occurred n times, then we would add
 * another (2^n-1) rules, not counting the rule we started with. 
 * @param {Rule} rule the rule from which the variable is removed
 * @param {String} variable the variable to remove
 * @param {boolean} LHSeliminated true if the LHS of this rule had a 
 *                  rule LHS -> epsilon and it was already, this prevent
 *                  this process from adding LHS -> epsilon again. However,
 *                  if false, we will add LHS -> epsilon this rule is
 *                  LHS -> variable.
 * @return {Array} a new rule from which each occurrence of the
 *                 variable are eliminated, empty if this rule doesn't
 *                 contain variable.
 */
export function eliminateEpsilonVariable(rule, variable, LHSeliminated = false) 
{
    // When the rule is LHS -> variable
    if(!rule.getRHS().localeCompare(variable))
    {
        if(LHSeliminated) 
        {
            return [];
        }
        return [new Rule(rule.getLHS().slice(), EMPTY)];
    }

    let indices = rule.indicesOf(variable);
    let addedRules = [];
    if(indices.length) // not empty
    {
        // 2**indices.length because of the exponential explosion as explained
        // in function header and -1 because we don't want string of all 1's
        for(let i = 0; i < (2**indices.length - 1); i++)
        {
            // convert to binary, pad to indices.length(), each 
            // binary string encode a specific the occurrence of variable
            let iInBinary = i.toString(2).padStart(indices.length, '0'); 

            // work in the reverse order so we don't encounter index issue
            let tempNewRuleRHS = rule.getRHS().slice();
            for(let j = iInBinary.length - 1; j >= 0; j--)
            {
                if(iInBinary[j] === '0')
                {
                    // effectively create the string RHS[0, indices[j]-1] + 
                    // RHS[indices[j] + variable.length, end] 
                    tempNewRuleRHS = tempNewRuleRHS.slice(0, indices[j]) + 
                                  tempNewRuleRHS.slice(indices[j] + variable.length);
                }
            }
            addedRules.push(new Rule(rule.getLHS(), tempNewRuleRHS));
        }
    }
    return addedRules;
}

/**
 * This function deal with the special case where 'rule' is the only rule of 
 * its variable. That is, 'rule' is of the form A -> epsilon where the variable
 * A has no other production rules. 
 * @param {CFG} cfg the cfg whose rules are checked and possibly eliminated.
 * @param {Rule} rule the rule to check.
 * @return {boolean} true if rule is the only rule of its variable, false otherwise
 */
function removePureEpsilonRule(cfg, rule) 
{
    // check if the LHS variable has this epsilon rule as it's only rule
    let hasOnlyEpsilon = true;
    for (const temp of cfg._rules) 
    {
        if (!temp.getLHS().localeCompare(rule.getLHS()) &&
            temp.getRHS().localeCompare(rule.getRHS())) 
        {
            hasOnlyEpsilon = false;
            break; // once we find another rule
        }
    }

    if(!hasOnlyEpsilon) 
    {
        return hasOnlyEpsilon; // false
    }

    // in this case, it is safe to clear the variable from the RHS of 
    // all rules in the grammar
    cfg._rules = cfg._rules.map((cur) => 
    {
        let variableToClear = rule.getLHS();
        let newRHS = cur.getRHS()
            .replace(new RegExp(variableToClear, 'g'), '');
        if(!newRHS.length) // '' should transform to EMPTY
        {
            newRHS = EMPTY;
        }
        return new Rule(cur.getLHS(), newRHS);
    });

    // and also remove the variable from the grammar since it has 
    // no rule anymore
    cfg._variables.delete(rule.getLHS());
    return hasOnlyEpsilon;
}

/***************************************************************************
 *                                                                         * 
 *                                                                         *
 *              Step Three: eliminate all unit rules                       *
 *                   i.e. rules of the form:                               *
 *                   A -> B, where B is a variable                         *
 *                                                                         *
 *                                                                         *
 ***************************************************************************/

/**
 * Step three in the conversion of a grammar to its chomsky normal form. In 
 * this step we remove all unit rules from the grammar, where a unit rule is
 * a rule of the form:
 * A -> B, where B is a variable.
 * Note: this function is pure, it does not change the argument, but instead
 * return a new CFG which has the changes.
 *
 * @param {CFG} cfg The CFG to be processed.
 * @returns {CFG} An equivalent CFG free of unit rules.
 */
export function eliminateUnitRules(cfg)
{
    // to ensure the function is pure
    let newCFG = new CFG();
    newCFG.copyFromCFG(cfg);

    let rules = newCFG._rules.map((cur) => 
    {
        return cur.toString();
    }); // array of rules in string form
    let unitRulesEliminated = rules.reduce((acc, cur) => 
    {
        if(!acc[cur])
        {
            acc[cur] = false;
        }
        return acc;
    }, Object.create(null)); // keep track of unit rules eliminated

    let unitRule = newCFG.findUnitRule(); // A -> B
    while(unitRule) 
    {
        newCFG.removeRule(unitRule); // remove this unit rule from the grammar
        // process only if it was not processed
        if(!unitRulesEliminated[unitRule.toString])
        {
            // gather all rules that are produced by unitRule.RHS(), i.e.
            // rules of the form B -> u, u a string of variables and terminals
            let rulesProducedByVariable = newCFG._rules.filter((cur) => 
            {
                return !cur.getLHS().localeCompare(unitRule.getRHS());
            });

            // add A -> u unless A -> u is a unit rule previously removed
            for(let rule of rulesProducedByVariable)
            {
                let ruleToAdd = new Rule(unitRule.getLHS(), rule.getRHS());
                if(!unitRulesEliminated[ruleToAdd.toString()])
                {
                    newCFG.addRule(ruleToAdd);
                }
            }

            newCFG.cleanUp(); // remove possibly redundant rules
            unitRulesEliminated[unitRule.toString()] = true; // mark it as processed
        }
        unitRule = newCFG.findUnitRule();
    }
    return newCFG;
}

/***************************************************************************
 *                                                                         *
 *                                                                         *
 *          Step Four: Convert remaining rules into proper form            *
 *                                                                         *
 *                                                                         *
 ***************************************************************************/

/**
 * This is the final step in the conversion from a CFG to its Chomsky normal
 * form, in this step, we convert all the rules in the grammar into proper form.
 * After previous steps, rules still remaining in this step is of the form:
 * V -> k1k2...kn, where n >= 2, and each ki is either a variable or terminal.
 * Note: this function is pure, it does not change the argument, but instead
 * return a new CFG which has the changes.
 *
 * @param {CFG} cfg The CFG to process.
 * @returns {CFG} An equivalent CFG in Chomsky normal form.
 */
export function convertRulesIntoProperForm(cfg)
{
    // so the function is pure
    let newCFG = new CFG();
    newCFG.copyFromCFG(cfg);    
    
    // we only need to process rules originally in cfg, this is different from
    // previous steps where we need to potentially process rules we added
    let originalRules = newCFG._rules.reduce((acc, cur) => 
    {
        let newRule = new Rule(cur.getLHS(), cur.getRHS()); // make deep copy
        acc.push(newRule);
        return acc;
    }, []);

    // then clear the old rules since we don't need them anymore
    newCFG._rules = [];

    // this dict helps us to remember which rules we can use to derive a single terminal
    // so it prevents the variable set from growing too big.
    // let dictOfTerminalRules = Object.create(null); 

    for(let rule of originalRules) 
    {
        let [newRules, newVariables] = breakLongRule(rule, newCFG.getTerminals(), null);
        newCFG._rules = newCFG._rules.concat(newRules);
        for(let temp of newVariables)
        {
            newCFG._variables.add(temp);
        }
    }
    return newCFG;
}

/**
 * This helper function of convertRulesIntoProperForm() will break a long rule of
 * the form: A -> k1k2...kn, n >= 3, into A -> k1A1, A1 -> k2A2, ..., An-2 -> kn-1kn.
 * It returns an array whose first element are the rules generated in this process,
 * and second element are the new variables generated in this process.
 * 
 * @param {Rule} rule The rule to break down.
 * @param {Set} terminals The set of terminals of the CFG.
 * @param {object} dict The dictionary of available rules to generate a terminal.
 * @returns {Array} An Array whose first element are the new rules generated in this process,
 *                 and second element are the new variables generated in this process.
 */
export function breakLongRule(rule, terminals, dict = null) 
{
    const arrayOfSymbols = parseRHS(rule.getRHS());
    let LHS = rule.getLHS();
    let newRules = []; 
    let newVariables = [];
    let newTerminalRules = []; // rules of the form A -> a

    if(terminals.has(arrayOfSymbols[0])) // if a terminal
    {
        newTerminalRules.push(new Rule(LHS + '(' + (arrayOfSymbols.length + 1) + ')', 
            arrayOfSymbols[0]));
        newVariables.push(LHS + '(' + (arrayOfSymbols.length + 1) + ')');
    }
    else
    {
        newRules.push(new Rule(LHS, arrayOfSymbols[0] + LHS + '(1)'));
    }

    newRules = arrayOfSymbols.slice(1, arrayOfSymbols.length - 2).reduce((acc, cur, idx) => 
    {
        const thisLHS = LHS + '(' + (idx + 1) + ')'; // e.g A2
        newVariables.push(thisLHS);
        let thisRHS;
        if (terminals.has(cur)) // if a terminal
        {
            const variableToCur = LHS + '(' + (arrayOfSymbols.length + idx + 1) + ')';
            newTerminalRules.push(new Rule(variableToCur, cur));
            newVariables.push(variableToCur);
            thisRHS = variableToCur + LHS + '(' + (idx + 2) + ')';
        }
        else 
        {
            thisRHS = cur + LHS + '(' + (idx + 2) + ')'; // e.g k2A2
        }
        acc.push(new Rule(thisLHS, thisRHS));
        return acc;
    }, newRules);  

    const lastVariable = LHS + '(' + (arrayOfSymbols.length - 2) + ')'; // An - 2
    let lastRHS = arrayOfSymbols[arrayOfSymbols.length - 2];
    if(terminals.has(arrayOfSymbols[arrayOfSymbols.length - 2]))
    {
        lastRHS = LHS + '(' +  (arrayOfSymbols.length - 1) + ')'; // An-1
        newTerminalRules.push(new Rule(LHS + '(' +  (arrayOfSymbols.length - 1) + ')',
            arrayOfSymbols[arrayOfSymbols.length - 2]));
        newVariables.push(LHS + '(' +  (arrayOfSymbols.length - 1) + ')');
    }
    if(terminals.has(arrayOfSymbols[arrayOfSymbols.length - 1]))
    {
        lastRHS = lastRHS.concat(LHS + '(' + arrayOfSymbols.length + ')'); // An
        newTerminalRules.push(new Rule(LHS + '(' + arrayOfSymbols.length + ')', 
            arrayOfSymbols[arrayOfSymbols.length - 1]));
        newVariables.push(LHS + '(' + arrayOfSymbols.length + ')');
    }
    else
    {
        lastRHS = lastRHS.concat(arrayOfSymbols[arrayOfSymbols.length - 1]);
    }

    newRules.push(new Rule(lastVariable, lastRHS));
    newVariables.push(lastVariable);

    // then concat newRules with newTerminalRules
    newRules = newRules.concat(newTerminalRules);
    return [newRules, newVariables];
}

/**
 * This helper function of convertRulesIntoProperForm() will take RHS of a rule 
 * and parse it, returning an array of variables and terminals. This function
 * assumes that a terminal or variable always starts with exactly 1 alphabetic letter,
 * that is: [a-z][A-Z], it fails to work otherwise. It also assumes that the 
 * input string consists of variable or terminals in the grammar.
 * E.g., 
 *      input: 'A_1aAB_3Rcb'
 *      output: ['A_1', 'a', 'A', 'B_3', 'R', 'c', 'b'].
 *
 * @param {string} RHS The RHS we want to parse.
 * @return {Array} An Array of variables and terminals, in the same order as they
 *                 appear in the string.
 */
export function parseRHS(RHS)
{
    let regEx = /[a-z]/i; // case insenstive search for next alphabetic char
    let indexOfNextSymbol = RHS.slice(1).search(regEx) + 1;
    let array = [];
    let string = RHS;
    while(indexOfNextSymbol >= 0) 
    {
        array.push(string.slice(0, indexOfNextSymbol));
        string = string.slice(indexOfNextSymbol);
        indexOfNextSymbol = string.slice(1).search(regEx) + 1;
        if(!indexOfNextSymbol)
        {
            array.push(string);
            break;
        }
    }
    return array;
}

