// All this shader code must go in a class. And then a lot more.
			var colorfulVertCode =
				`#version 300 es\n 
				uniform mat4 u_modelview_matrix;
				uniform mat4 u_projection_matrix;
				in vec3 a_vertex_coordinates;
				in vec3 a_vertex_color;
				out vec3 color_out;
				void main(void)
				{
					gl_Position = u_projection_matrix * u_modelview_matrix * vec4(a_vertex_coordinates, 1.0);
					color_out = a_vertex_color;
				}`;
	
			var colorfulFragCode =
				`#version 300 es\n
				precision mediump float;
				in vec3 color_out;
				out vec4 color;
				void main(void)
				{
					color = vec4(color_out, 1.0);
				}`;
class ColorfulShader extends Shader
{
    constructor(mdv,prj)
    {
        super(colorfulVertCode, colorfulFragCode);
        this.temp = this.program;
        // Things that are custom to this type of shader.
        this.color_attribute_handle = gl.getUniformLocation(this.program, "a_vertex_color");
		this.vertex_attribute_handle = gl.getAttribLocation(this.program, "a_vertex_coordinates");
		this.SetStandardUniforms(mdv, prj);
		return this.program;
    }
}