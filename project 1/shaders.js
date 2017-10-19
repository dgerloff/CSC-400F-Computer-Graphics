;

class Shader
{
    constructor(vert, frag)
    {
        this.program = this.CreateShader(vert, frag);
        this.GetStandardUniformHandles();        
    }

    getShaderSource(source)
    {
        var code;
  
        var e = document.getElementById(source);
        if (!e)
            code = source;
        else
            code = e.text;
        return code;
    }

    CreateShader(vert, frag)
    {
        if (vert == null || vert == undefined)
            throw 'Shader::CreateShader() - Undefined vertex shader';

        if (frag == null || frag == undefined)
            throw 'Shader::CreateShader() - Undefined fragment shader';
        
        var vertex_code;
        var fragment_code;

        vertex_code = this.getShaderSource(vert);
        fragment_code = this.getShaderSource(frag);
        // At this point we have something in vertex and fragment code which could be real code 
        // or bogusness which will not compile (thus catching that error).

        var vertShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertShader, vertex_code);
        gl.compileShader(vertShader);
        var success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
        if (!success)
            throw "Shader::CreateShader() - Could not compile vertex shader:" + gl.getShaderInfoLog(vertShader);

        var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragShader, fragment_code);
        gl.compileShader(fragShader);
        success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
        if (!success)
            throw "Could not compile fragment shader:" + gl.getShaderInfoLog(fragShader);

        // retval is the handle (something that identifies) the actual exectable on the GPU.
        // When retval is returned it goes into this.program. Thereafter, referring to this.program
        // is a reference to a specific instance of a shader executable on the GPU.
        var retval = gl.createProgram();
        gl.attachShader(retval, vertShader); 
        gl.attachShader(retval, fragShader);
        gl.linkProgram(retval);

        return retval;
    }

    GetStandardUniformHandles()
    {
        this.modelview_matrix_handle = gl.getUniformLocation(this.program, "u_modelview_matrix");
        this.projection_matrix_handle = gl.getUniformLocation(this.program, "u_projection_matrix");
    }

    SetStandardUniforms(mdv, prj)
    {
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(this.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(this.modelview_matrix_handle, false, mdv);
    }
}