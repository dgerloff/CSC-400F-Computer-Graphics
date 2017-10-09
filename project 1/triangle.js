;

class Triangle extends Shape
{
    constructor()
    {
        super(true);
		this.CreateBuffers();
		
		this.triangle_vrts = [
			-0.5, -0.5, 0,
			0.5, -0.5, 0,
			0.0, 0.5, 0
		];

		// This makes the triangles
		this.indicies = [0, 1, 2];

		// This makes the line segements
		this.line_segment_indicies = [
			0, 1,
			1, 2,
			2, 0
		]

		this.colors = [
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		];

		this.normal_vrts = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

		this.normal_display_vrts = [
			-0.5, -0.5, 0,
			-0.5, -0.5, 0.1,
			0.5, -0.5, 0,
			0.5, -0.5, 0.1,			
			0.0, 0.5, 0,
			0.0, 0.5, 0.1
		];
        

        // stuff
        this.BindBuffers();
    }
    Reshape(verts)
    {
        this.triangle_vrts = verts.slice();
        this.v = [];
        this.vec1 = [];
        this.vec2 = [];
        this.display_norms = [];
        for(var i=0;i<3;i++)
        {
            this.v[i] = this.triangle_vrts.slice(i * 3, (i * 3) + 3);
        }
        vec3.subtract(this.vec1, this.v[0], this.v[1]);
        vec3.subtract(this.vec2, this.v[0], this.v[2]);
        this.norm=[];
        vec3.cross(this.norm, this.vec1, this.vec2);
        vec3.normalize(this.norm, this.norm);
        vec3.multiply(this.display_norms, this.norm, [.1, .1, .1]);
        this.normal_vrts = [];
        for (var i = 0; i < 3; i++)
        {
            this.normal_vrts.push(this.norm[0],this.norm[1],this.norm[2]);
        }
        this.normal_display_vrts = [];
        for (var i = 0; i < 3; i++)
        {
            this.normal_display_vrts.push(this.triangle_vrts[i * 3], this.triangle_vrts[(i * 3)+1], this.triangle_vrts[(i * 3)+2]);
            this.normal_display_vrts.push(this.display_norms[0] + this.triangle_vrts[i * 3], this.display_norms[1] + this.triangle_vrts[(i * 3) + 1], this.display_norms[2] + this.triangle_vrts[(i * 3) + 2]);
        }
        this.BindBuffers();
    }
    
}