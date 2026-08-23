package com.unicesar.roomies.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "alojamientos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alojamiento implements Reservable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private String direccion;

    @Column(nullable = false, length = 100)
    private String ciudad;

    @Column(nullable = false, length = 100)
    private String barrio;

    @Column(name = "tiempo_caminando_universidad")
    private String tiempoCaminandoUniversidad;

    @Column(precision = 10, scale = 8)
    private BigDecimal latitud;

    @Column(precision = 11, scale = 8)
    private BigDecimal longitud;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_alojamiento", nullable = false)
    private TipoAlojamiento tipoAlojamiento;

    @Column(name = "precio_mensual", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioMensual;

    @Column(name = "metros_cuadrados", precision = 8, scale = 2)
    private BigDecimal metrosCuadrados;

    @Column(name = "numero_cuartos")
    private Integer numeroCuartos;

    private Integer capacidad;

    @ElementCollection
    @CollectionTable(name = "alojamiento_servicios", joinColumns = @JoinColumn(name = "alojamiento_id"))
    @Column(name = "servicio")
    private List<String> serviciosIncluidos = new ArrayList<>();

    private Boolean amoblado;

    @Column(name = "banio_privado")
    private Boolean banioPrivado;

    @Column(name = "buscando_roomie")
    private Boolean buscandoRoomie;

    @ElementCollection
    @CollectionTable(name = "alojamiento_imagenes", joinColumns = @JoinColumn(name = "alojamiento_id"))
    @Column(name = "url_imagen")
    private List<String> imagenes = new ArrayList<>();

    @Column(name = "puntuacion_promedio", precision = 3, scale = 2)
    private BigDecimal puntuacionPromedio;

    @Column(name = "fecha_publicacion", nullable = false, updatable = false)
    private LocalDateTime fechaPublicacion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAlojamiento estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "propietario_id", nullable = false)
    private Propietario propietario;

    @ManyToMany
    @JoinTable(
        name = "alojamiento_reglas",
        joinColumns = @JoinColumn(name = "alojamiento_id"),
        inverseJoinColumns = @JoinColumn(name = "regla_id")
    )
    private List<Regla> reglas = new ArrayList<>();

    @OneToMany(mappedBy = "alojamiento", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Resena> resenas = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.fechaPublicacion = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoAlojamiento.DISPONIBLE;
        }
    }

    // Implementación de la interfaz Reservable
    @Override
    public Boolean estaDisponible() {
        return EstadoAlojamiento.DISPONIBLE.equals(this.estado);
    }

    @Override
    public void reservar() {
        if (!estaDisponible()) {
            throw new IllegalStateException("El alojamiento no está disponible para reservar.");
        }
        this.estado = EstadoAlojamiento.RESERVADO;
    }
}