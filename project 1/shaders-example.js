class Material
{
	constructor()
	{
		this.k_ambient = vec3.create();
		this.k_diffuse = vec3.create();
		this.k_specular = vec3.create();
		this.k_shininess = 80.0;
		this.color = vec4.create();
	}

	clone() 
	{
		var copy = new Material();
		for (var attr in this) {
			if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
		}
		return copy;
	}

};

class Shader
{
	/**
	 *	NOTE - NOTE - NOTE:
	 *	If an attribute is missing, it gets assigned a value of -1.
	 * 	If a uniform is missing, it gets assigned a value of null. 
	 * 	You have been warned.
	 */

	/**
	* Shader constructor which takes the DOM id of both a vertex and fragment shader.
	* For example, given:
	* 	<script id="phong_lighting_vertex_shader" type="x-shader/x-vertex">
	* one would call the constructor like so:
	* new Shader(phong_lighting_vertex_shader.id, ...
	* NOTE - NOTE - NOTE - the program will halt if any errors are found during compilation and linking.
	* @param {string} the DOM id of the vertex shader
	* @param {string} the DOM id of the fragment shader
	* @return {none} no return value
	*/	
	constructor(vrtx_id, frag_id)
	{
		// NOTE - NOTE - NOTE - the program will halt if any errors are found during compilation and linking.
		this.prog = this.CreateShader(vrtx_id, frag_id);
		this.InitializeShader();
	}

	/**
	* Initialize a shader: define all attribute and uniform handles.
	* NOTE - NOTE - NOTE - All shaders managed by this class follow a "standardized" set of
	* stock uniforms and attributes. Some shaders may not make use of "a_colors" for example
	* but all will attempt to define it. The later code used to call the shader will ensure
	* that attributes and uniforms that are not used will not be configured for use. Such
	* use would cause a runtime error.
	* @param {none} no parameters
	* @return {none} no return value
	*/
	InitializeShader()
	{
		gl.useProgram(this.prog);
		this.a_vertices = gl.getAttribLocation(this.prog, "a_vertices");
		this.a_normals = gl.getAttribLocation(this.prog, "a_normals");
		this.a_colors = gl.getAttribLocation(this.prog, "a_colors");
		this.a_tcoords = gl.getAttribLocation(this.prog, "a_tcoords");
		this.u_color_handle = gl.getUniformLocation(this.prog, "u_color");
		this.u_normal_matrix_handle = gl.getUniformLocation(this.prog, "u_normal_matrix");
		this.u_light_position_handle = gl.getUniformLocation(this.prog, "u_light_position");
		this.u_modelview_matrix_handle = gl.getUniformLocation(this.prog, "u_modelview_matrix");
		this.u_projection_matrix_handle = gl.getUniformLocation(this.prog, "u_projection_matrix");
		this.u_ambient_handle = gl.getUniformLocation(this.prog, "u_material.k_ambient");
		this.u_diffuse_handle = gl.getUniformLocation(this.prog, "u_material.k_diffuse");
		this.u_specular_handle = gl.getUniformLocation(this.prog, "u_material.k_specular");
		this.u_shininess_handle = gl.getUniformLocation(this.prog, "u_material.k_shininess");
		this.u_parameter_handle = gl.getUniformLocation(this.prog, "u_parameter");
		//debugger;
		this.u_texture1_handle = gl.getUniformLocation(this.prog, "u_texture1");
		this.u_texture2_handle = gl.getUniformLocation(this.prog, "u_texture2");
		this.u_texture1_enable_handle = gl.getUniformLocation(this.prog, "u_texture1_enable");
		this.u_texture2_enable_handle = gl.getUniformLocation(this.prog, "u_texture2_enable");
		if (this.u_texture1_enable_handle != null)
			gl.uniform1i(this.u_texture1_enable_handle, false);
		if (this.u_texture2_enable_handle != null)
			gl.uniform1i(this.u_texture2_enable_handle, false);

		//console.log(this.u_diffuse_handle, this.u_ambient_handle, this.u_specular_handle);
		gl.useProgram(null);
	}

	/**
	* Disables the standard shader attributes. Attributes if valid, have a value of
	* zero or greater. Each standard attribute is tested against zero and if greater
	* the disableVertexAttribArray function is called.
	* @param {none} no parameters
	* @return {none} no return value
	*/
	DisableStandardAttributes()
	{
		if (this.a_vertices >= 0)
			gl.disableVertexAttribArray(this.a_vertices);
		if (this.a_normals >= 0)
			gl.disableVertexAttribArray(this.a_normals);
		if (this.a_colors >= 0)
			gl.disableVertexAttribArray(this.a_colors);
		if (this.a_tcoords >= 0)
			gl.disableVertexAttribArray(this.a_tcoords);
	}

	/**
	* Enables "this" shader program.
	* @param {none} no parameters
	* @return {none} no return value
	*/
	UseProgram()
	{
		gl.useProgram(this.prog);
	}

	/**
	* Disables "this" shader program. This function is simply symetry with UseProgram().
	* @param {none} no parameters
	* @return {none} no return value
	*/
	EndProgram()
	{
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
	SetStandardAttributes(vertices_buffer, normals_buffer, colors_buffer, tcoords_buffer)
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
		if (tcoords_buffer != null && this.a_tcoords >= 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, tcoords_buffer);
			gl.vertexAttribPointer(this.a_tcoords, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.a_tcoords);
		}
	}

	SetTexture(texture_number, texture)
	{
		var t = null;
		var r = null;
		var e = null;
		var do_texture = false;

		switch (texture_number)
		{
			case 0:
				do_texture = this.texture1_enable = (texture != null && texture != undefined);
				r = gl.TEXTURE0;
				t = this.u_texture1_handle;
				e = this.u_texture1_enable_handle;
				if (e != null || (texture != null && texture.loaded == false))
					gl.uniform1i(e, this.texture1_enable);
				break;

			case 1:
				do_texture = this.texture2_enable = (texture != null && texture != undefined);
				r = gl.TEXTURE1;
				t = this.u_texture2_handle;
				e = this.u_texture2_enable_handle;
				if (e != null || (texture != null && texture.loaded == false))
					gl.uniform1i(e, this.texture1_enable);
				break;
		}

		// There is no texture support in the shader 
		if (t == null || e == null)
			return;

		var error = 0;
		//if ((error = gl.getError()) != gl.NO_ERROR)
		//	throw error;
		if (do_texture)
		{
			gl.activeTexture(r);
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.uniform1i(t, texture_number);
			if ((error = gl.getError()) != gl.NO_ERROR)
				throw 'Error setting texture: ' + error;
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
	SetStandardUniforms(modelview_matrix, projection_matrix, normal_matrix, light_position, material, parameter)
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
		if (material != null)
		{
			if (material.color != null && this.u_color_handle != null)
				gl.uniform4fv(this.u_color_handle, material.color);
			if (material.k_ambient != null && this.u_ambient_handle != null)
				gl.uniform3fv(this.u_ambient_handle, material.k_ambient);
			if (material.k_diffuse != null && this.u_diffuse_handle != null)
				gl.uniform3fv(this.u_diffuse_handle, material.k_diffuse);
			if (material.k_specular != null && this.u_specular_handle != null)
				gl.uniform3fv(this.u_specular_handle, material.k_specular);
			if (material.k_shininess != null && this.u_shininess_handle != null)
				gl.uniform1f(this.u_shininess_handle, material.k_shininess);		
		}
		if (parameter != null && this.u_parameter_handle != null)
			gl.uniform1f(this.u_parameter_handle, parameter);		
	}

	/**
	* Compile and link shader programs
	* @param {string} id string for the vertex shader
	* @param {string} id string for the fragment shader 
	* @return {Number} the gl shader program number
	*
	* Some elements drawn from: https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html
	*/
	CreateShader(vrtx_id, frag_id)
	{
		if (!vrtx_id)
			throw"Parameter 1 to CreateShader may be missing.";

		if (!frag_id)
			throw "Parameter 2 to CreateShader may be missing.";

		var success;

		var vrtx = document.getElementById(vrtx_id);
		if (!vrtx)
			throw "Could not find script element " + vrtx_id;
		vrtx = vrtx.text;

		var frag = document.getElementById(frag_id);
		if (!frag)
			throw "Could not find script element " + frag_id;
		frag = frag.text;

		var vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, vrtx);
		gl.compileShader(vertShader);
		success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
		if (!success)
			throw "Could not compile vertex shader:" + gl.getShaderInfoLog(vertShader);

		var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, frag);
		gl.compileShader(fragShader);
		success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
		if (!success)
			throw "Could not compile fragment shader:" + gl.getShaderInfoLog(fragShader);

		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertShader); 
		gl.attachShader(shaderProgram, fragShader);
		gl.linkProgram(shaderProgram);
		success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
		if (!success)
			throw ("Shader program filed to link:" + gl.getProgramInfoLog (shaderProgram));
			
		return shaderProgram;
	}
}