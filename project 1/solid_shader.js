;

solid_vertex_shader =
`#version 300 es\n 
uniform mat4 u_modelview_matrix;
uniform mat4 u_projection_matrix;
in vec3 a_vertex_coordinates;
void main(void)
{
    gl_Position = u_projection_matrix * u_modelview_matrix * vec4(a_vertex_coordinates, 1.0);
}`;

solid_fragment_shader = 
`#version 300 es\n
precision mediump float;
uniform vec3 u_color;
out vec4 color;
void main(void)
{
    color = vec4(u_color, 1.0);
}`;

class SolidColorShader extends Shader
{
    constructor()
    {
        super(solid_vertex_shader, solid_fragment_shader);
        debugger;
        // Things that are custom to this type of shader.
    }
}