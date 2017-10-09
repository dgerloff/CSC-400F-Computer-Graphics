;

class Shape
{
    constructor(indexed)
    {
        this.type = "Uninitialized";
        this.primitive = gl.TRIANGLES;
        this.indexed = indexed;
        this.triangle_vrts = [];
        this.texture_coords = [];
        this.normal_display_vrts = [];
		this.normal_vrts = [];
		this.colors = [];

		this.colors_buffer = null;
		this.texture_coords_buffer = null;
		this.triangle_vrts_buffer = null;
		this.normal_display_vrts_buffer = null;
		this.normal_vrts_buffer = null;

        if (indexed)
        {
            this.indicies = [];
            this.line_segment_indicies = [];
            this.indicies_buffer = null;
            this.line_segment_indicies_buffer = null;
        }
        else
        {
            this.line_segment_vrts = [];
            this.line_segment_vrts_buffer = null;
        }
    }

    CreateBuffers()
    {
        if (this.triangle_vrts_buffer != null)
            throw 'vertex buffer was already initialized';
            
		this.triangle_vrts_buffer = gl.createBuffer();
		this.normal_display_vrts_buffer = gl.createBuffer();
		this.normal_vrts_buffer = gl.createBuffer();
		this.colors_buffer = gl.createBuffer();
		
		if (this.indexed)
		{
			this.indicies_buffer = gl.createBuffer();
			this.line_segment_indicies_buffer = gl.createBuffer();
		}
		else
		{
			this.line_segment_vrts_buffer = gl.createBuffer();
		}
    }

	// BindBuffers() stuffs data into the right places on the GPU for this shape.
	// It can be called over and over if you need to change any of this data on
	// the fly. Though, if that is the case you might consider making STATIC_DRAW
	// or DYNAMIC_DRAW a member variable. 
    BindBuffers()
    {
		if (this.triangle_vrts.length == 0)
			throw 'Shape::BindBuffers called with empty vertices';

		// All shapes must have verticies.
        gl.bindBuffer(gl.ARRAY_BUFFER, this.triangle_vrts_buffer);        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.triangle_vrts), gl.STATIC_DRAW);

		// Although not checked, all shapes ought to have normals per vertex.
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_vrts_buffer);        
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_vrts), gl.STATIC_DRAW);

		// Display normals are optional.
		if (this.normal_display_vrts.length > 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normal_display_vrts_buffer);        
    	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_display_vrts), gl.STATIC_DRAW);
		}

		// Colors are optional.
		if (this.colors.length > 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, this.colors_buffer);        
    	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
		}

		if (this.indexed)
		{
			// Only indexed shapes make use of ELEMENT_ARRAY_BUFFER.
			if (this.indicies_buffer != null && this.indicies.length > 0)
			{
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicies_buffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(this.indicies), gl.STATIC_DRAW);
			}
			else
			{
				throw 'Shape::BindBuffers() - indexed but no index buffer or no index data.';
			}
		
			if (this.line_segment_indicies_buffer != null && this.line_segment_indicies.length > 0)
			{
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.line_segment_indicies_buffer);
				gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(this.line_segment_indicies), gl.STATIC_DRAW);
			}

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
		}
		else
		{
			// you complete this
		}

		gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

	BindEnableAttribute(attribute, buffer, number, type)
	{
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(attribute, number, type, false, 0, 0);
		gl.enableVertexAttribArray(attribute);
	}

	// Draw will change a lot when a shader class is created. Shaders are then passed here
	// as parameters permitting them to be mixed and matched. This simplified Draw assumes
	// the caller has already set up the appropriate shaders.
    Draw(va, ca, draw_faces, draw_normals, draw_wireframe, show_triangles)
    {
		if (draw_faces)
		{
			this.BindEnableAttribute(va, this.triangle_vrts_buffer, 3, gl.FLOAT);
			this.BindEnableAttribute(ca, this.colors_buffer, 3, gl.FLOAT);

			// If draw_wireframe is false, draw the actual faces.
			if (this.indexed)
			{
				if (this.indicies_buffer == null || this.indicies.length == 0)
					throw 'Shape::Draw() - indices not initialized correctly.';

				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicies_buffer);
				gl.drawElements(this.primitive, this.indicies.length, gl.UNSIGNED_SHORT, 0);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
			}
			else
			{
				gl.drawArrays(this.primitive, 0, this.triangle_vrts.length / 3);
			}
			gl.disableVertexAttribArray(va);
			gl.disableVertexAttribArray(ca);
		}
		// Question... this code structure assumes only one shader right? There is no
		// switching of shaders here so... if show_triangles is true and draw_wireframe
		// is false, how would you see the triangle edges?
		if (draw_wireframe || show_triangles)
		{
			this.BindEnableAttribute(va, this.triangle_vrts_buffer, 3, gl.FLOAT);

			if (this.indexed)
			{
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.line_segment_indicies_buffer);
				gl.drawElements(gl.LINES, this.line_segment_indicies.length, gl.UNSIGNED_SHORT, 0);
				gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
			}
			else
			{
				// You do this
			}			
			gl.disableVertexAttribArray(va);
		}

		if (draw_normals)
		{
			this.BindEnableAttribute(va, this.normal_display_vrts_buffer, 3, gl.FLOAT);
			gl.drawArrays(gl.LINES, 0, this.normal_display_vrts.length / 3);
			gl.disableVertexAttribArray(va);
		}
    }
}