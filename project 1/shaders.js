;
class Shader 
{
	constructer(vertex_id,frag_id)//,phong)
	{
		this.shader_program=this.create_shader(vertex_id,frag_id);
		this.initialize_shader();
	}
	create_shader(vertex_id,frag_id)
	{
		if (!vertex_id)
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
	initialize_shader()
	{
		gl.useProgram(this.shader_program);
		this.a_vertices = gl.getAttribLocation(this.shader_program, "a_vertices");
		this.a_normals = gl.getAttribLocation(this.shader_program, "a_normals");
		this.a_colors = gl.getAttribLocation(this.shader_program, "a_colors");
		//this.a_tcoords = gl.getAttribLocation(this.shader_program, "a_tcoords");
		this.u_color_handle = gl.getUniformLocation(this.shader_program, "u_color");
		this.u_normal_matrix_handle = gl.getUniformLocation(this.shader_program, "u_normal_matrix");
		this.u_light_position_handle = gl.getUniformLocation(this.shader_program, "u_light_position");
		this.u_modelview_matrix_handle = gl.getUniformLocation(this.shader_program, "u_modelview_matrix");
		this.u_projection_matrix_handle = gl.getUniformLocation(this.shader_program, "u_projection_matrix");
		this.u_ambient_handle = gl.getUniformLocation(this.shader_program, "u_material.k_ambient");
		this.u_diffuse_handle = gl.getUniformLocation(this.shader_program, "u_material.k_diffuse");
		this.u_specular_handle = gl.getUniformLocation(this.shader_program, "u_material.k_specular");
		this.u_shininess_handle = gl.getUniformLocation(this.shader_program, "u_material.k_shininess");
		gl.useProgram(null);
	}
	/**
	* Attributes are assigned values IF the attribute handle is zero or greater.
	* @param {glbuffer} the vertices (null if none).
	* @param {glbuffer} the normals (null if none).
	* @param {glbuffer} the vertex colors (null if none).
	* @param {glbuffer} the vertex texture coordinates (null if none).
	* @return {none} no return value
	*/
	SetStandardAttributes(vertices_buffer, normals_buffer, colors_buffer)
	{
		if (vertices_buffer != null && this.a_vertices >= 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, vertices_buffer);
			gl.vertexAttribPointer(this.a_vertices, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.a_vertices);
		}
		if (normals_buffer != null && this.a_normals >= 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer);
			gl.vertexAttribPointer(this.a_normals, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.a_normals);
		}
		if (colors_buffer != null && this.a_colors >= 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, colors_buffer);
			gl.vertexAttribPointer(this.a_colors, 4, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.colors);
		}
	}
		/**
	* Uniforms are assigned values IF the uniform handle is not null AND the 
	* corresponding argument has been supplied.
	* @param {mat4} modelview_matrix (null if none).
	* @param {mat4} projection_matrix (null if none).
	* @param {mat4} normal_matrix (null if none).
	* @param {vec4} light_position (null if none).
	* @param {struct} a material (null if none).
	* @return {none} no return value
	*/
	SetStandardUniforms(modelview_matrix, projection_matrix, normal_matrix, light_position)
	{
		//console.log(this.u_diffuse_handle);

		if (modelview_matrix != null && this.u_modelview_matrix_handle != null)
			gl.uniformMatrix4fv(this.u_modelview_matrix_handle, false, modelview_matrix);	
		if (projection_matrix != null && this.u_projection_matrix_handle != null)
			gl.uniformMatrix4fv(this.u_projection_matrix_handle, false, projection_matrix);	
		if (normal_matrix != null && this.u_normal_matrix_handle != null)
			gl.uniformMatrix3fv(this.u_normal_matrix_handle, false, normal_matrix);
		if (light_position != null && this.u_light_position_handle != null)
			gl.uniform4fv(this.u_light_position_handle, light_position);		
	}

	UseProgram()
	{
		gl.useProgram(this.prog);
	}
		EndProgram()
	{
		gl.useProgram(null);
	}
}