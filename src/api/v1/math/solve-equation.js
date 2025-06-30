function evaluateExpression(expression) {
    try {
        const cleanExpression = expression.replace(/\s/g, '');
        
        if (!/^[0-9+\-*/().]+$/.test(cleanExpression)) {
            throw new Error('Invalid characters in expression');
        }
        
        const result = Function('"use strict"; return (' + cleanExpression + ')')();
        
        // Check if result is a valid number
        if (typeof result !== 'number' || !isFinite(result)) {
            throw new Error('Invalid calculation result');
        }
        
        return result;
    } catch (error) {
        throw new Error('Invalid mathematical expression');
    }
}

import { checkApiKey } from '../../data/auth';

export default function handler(req, res) {
  if (!checkApiKey(req, res)) {
    return; // Stop processing if not authorized
  }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Type', 'application/json');
    
    // Handle only GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: "Method Not Allowed, this endpoint uses only 'GET' requests." });
    }
    
    let { equation } = req.query;
    
    if (equation) {
        equation = equation.replace(/\s+/g, '+');
    }
    
    if (!equation) {
        return res.status(400).json({ 
            error: 'Missing equation parameter',
            usage: 'Example: /v1/solve-equation?equation=2+2*3'
        });
    }
    
    try {
        // Calculate result
        const result = evaluateExpression(equation);
        
        // Return successful response
        return res.status(200).json({
            equation: equation,
            result: result,
            success: true,
            info: {
                credits: "Made by harys722, available only everyone.",
                support: "https://harys.is-a.dev/api"
            }
        });
        
    } catch (error) {
        // Return error response
        return res.status(400).json({
            error: error.message,
            equation: equation,
            success: false
        });
    }
}
