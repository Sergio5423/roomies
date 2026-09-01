package com.unicesar.roomies.model.entity.dto;

import com.unicesar.roomies.model.entity.TipoPerfil;
import lombok.Data;

@Data
public class RegistroRequestDTO {
    private String nombreCompleto;
    private String emailInstitucional;
    private String telefono;
    private String password;
    private TipoPerfil tipoPerfil;
}