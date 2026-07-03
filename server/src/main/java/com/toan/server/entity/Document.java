@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String documentNumber;

    private String summary;

    private String issuingAgency;

    private LocalDate enactedDate;

    private LocalDate effectiveDate;

    private LocalDate expireDate;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private DocumentCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "document")
    private List<Attachment> attachments = new ArrayList<>();

    @OneToMany(mappedBy = "document")
    private List<Notification> notifications = new ArrayList<>();
}