# OpenAI DALL-E Troubleshooting Guide

This guide will help you troubleshoot issues with the OpenAI DALL-E image generation in the Text-to-Image Generator application.

## Important Update: DALL-E 2 Deprecation

> **Note:** OpenAI is no longer allowing new users to access DALL-E 2. DALL-E 3 has higher quality images, improved prompt adherence, and new features like image editing. DALL-E 3 is available for ChatGPT Plus, Team and Enterprise users, and through the OpenAI API.

Our application has been updated to use **only DALL-E 3**. All references to DALL-E 2 in this guide are for historical purposes only.

## Common DALL-E Generation Issues

### 1. Authentication Errors

**Symptoms:**
- Error message: "Authentication failed"
- HTTP 401 status code

**Possible Causes:**
- Invalid API key
- Expired API key
- API key entered incorrectly

**Solutions:**
1. Verify your OpenAI API key at [platform.openai.com](https://platform.openai.com/api-keys)
2. Generate a new API key if necessary
3. Make sure the key is properly set in your environment variables:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
4. Check for extra spaces or formatting issues in your key

### 2. Insufficient Quota or Credits

**Symptoms:**
- Error message: "Rate limit exceeded or insufficient quota"
- HTTP 429 status code

**Possible Causes:**
- Free trial quota exceeded
- Payment method issues
- Organization spending limits reached
- Account suspended

**Solutions:**
1. Check your usage and billing status at [platform.openai.com/billing](https://platform.openai.com/billing)
2. Add credits to your account if needed
3. Update your payment method if it has failed
4. Contact OpenAI support if your account has been suspended

### 3. Content Policy Violations

**Symptoms:**
- Error message: "Your request was rejected as a result of our safety system"
- HTTP 400 status code

**Possible Causes:**
- Prompt contains prohibited content
- Trying to generate unsafe or policy-violating images

**Solutions:**
1. Review the [OpenAI content policy](https://platform.openai.com/docs/guides/safety-best-practices)
2. Revise your prompt to remove potentially problematic content
3. Make your prompt more specific and descriptive but avoid policy violations
4. Use more abstract or artistic descriptions

### 4. DALL-E API Version Issues

**Symptoms:**
- Error message: "Invalid response from OpenAI API"
- Unexpected response structure

**Possible Causes:**
- API version mismatch
- OpenAI changed their API structure
- Using deprecated parameters

**Solutions:**
1. Check the latest [OpenAI API documentation](https://platform.openai.com/docs/api-reference/images/create)
2. Update your code to match the current API parameters
3. Ensure you're using DALL-E 3 (as DALL-E 2 is now deprecated)
4. Update to the latest version of the application

### 5. Connection Timeouts

**Symptoms:**
- Error message: "OpenAI request timed out"
- Request hangs for a long time

**Possible Causes:**
- OpenAI servers are experiencing high load
- Network issues
- Application timeout settings too short

**Solutions:**
1. Retry your request after a few minutes
2. Check your internet connection
3. Increase the timeout setting in the application (currently set to 60 seconds)
4. Check OpenAI's [system status](https://status.openai.com/)

## Advanced Troubleshooting

### Testing the API Directly

You can test the OpenAI API directly using curl:

```bash
curl https://api.openai.com/v1/images/generations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "dall-e-3",
    "prompt": "A simple test image of a blue circle",
    "n": 1,
    "size": "1024x1024"
  }'
```

### DALL-E 3 Parameter Options

DALL-E 3 supports the following parameters:

1. **Size Options**:
   - `1024x1024` (standard square)
   - `1792x1024` (wide landscape)
   - `1024x1792` (tall portrait)

2. **Quality Options**:
   - `standard` (default)
   - `hd` (higher quality, costs more credits)

3. **Style Options**:
   - `vivid` (more dramatic, high contrast)
   - `natural` (more subdued, realistic)

You can modify these in the backend code:

```javascript
const requestData = {
  model: "dall-e-3",
  prompt,
  n: 1,
  size: "1024x1024", // or "1792x1024" for landscape
  quality: "standard", // or "hd" for higher quality
  response_format: "url",
  style: "vivid" // or "natural" for more subdued style
};
```

## Getting Help

If you continue to face issues:

1. Check the OpenAI [documentation](https://platform.openai.com/docs/guides/images)
2. Visit the OpenAI [community forum](https://community.openai.com/)
3. Contact OpenAI [support](https://help.openai.com/en/)
4. Use the API diagnostics tool in the application (development mode only) to verify your API connectivity 