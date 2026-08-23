package com.unicesar.roomies.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "publicaciones_roomie")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicacionRoomie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "descripcion_presentacion", columnDefinition = "TEXT", nullable = false)
    private String descripcionPresentacion;

    @Column(name = "presupuesto_minimo", precision = 12, scale = 2)
    private BigDecimal presupuestoMinimo;

    @Column(name = "presupuesto_maximo", precision = 12, scale = 2)
    private BigDecimal presupuestoMaximo;

    @Column(name = "carrera_filtro", length = 100)
    private String carreraFiltro;

    @Column(name = "fecha_publicacion", nullable = false, updatable = false)
    private LocalDateTime fechaPublicacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPublicacion estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inquilino_id", nullable = false)
    private Inquilino inquilino;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "alojamiento_id")
    private Alojamiento referenciaAlojamiento;

    @PrePersist
    protected void onCreate() {
        this.fechaPublicacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoPublicacion.ACTIVA;
        }
    }
}