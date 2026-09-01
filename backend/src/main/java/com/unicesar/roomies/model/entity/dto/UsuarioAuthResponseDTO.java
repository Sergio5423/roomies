package com.unicesar.roomies.model.entity.dto;

import com.unicesar.roomies.model.entity.TipoPerfil;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioAuthResponseDTO {
    private Long id;
    private String nombreCompleto;
    private String emailInstitucional;
    private TipoPerfil tipoPerfil;
    private String mensaje;
}