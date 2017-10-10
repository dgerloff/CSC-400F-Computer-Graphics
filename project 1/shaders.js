;
class Shader 
{
	create_shader(vertex_id,frag_id)
	{
		if (!vrtx_id)
			throw"Parameter 1 to CreateShader may be missing.";

		if (!frag_id)
			throw "Parameter 2 to CreateShader may be missing.";
		//vert
		var vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, vertex_id);
		gl.compileShader(vertShader);
		var success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
		if (!success)
			throw "Could not compile vertex shader:" + gl.getShaderInfoLog(vertShader);
		//frag
		var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(fragShader, frag_id);
			gl.compileShader(fragShader);
			success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
			if (!success)
				throw "Could not compile fragment shader:" + gl.getShaderInfoLog(fragShader);
		//combine
		var colorfulShaderProgram = gl.createProgram();
			gl.attachShader(colorfulShaderProgram, vertShader); 
			gl.attachShader(colorfulShaderProgram, fragShader);
			gl.linkProgram(colorfulShaderProgram);
			return colorfulShaderProgram;
	}
	
}