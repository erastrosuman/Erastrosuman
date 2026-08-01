/**
 * SudnadiAstro — Database type definitions.
 *
 * These mirror the Supabase Postgres schema created in the SQL migrations.
 * They provide full type safety when using the Supabase client.
 */

// ─── Enum types ─────────────────────────────────────────────

export type BookingStatus =
  "draft" | "pending_payment" | "paid" | "processing" | "completed" | "cancelled" | "failed";

export type OrderStatus = "created" | "pending" | "success" | "failure" | "refunded";

export type ContactStatus = "new" | "read" | "replied" | "closed";

export type AdminRole = "admin" | "editor";

// ─── Row types ──────────────────────────────────────────────

export type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  tagline: string;
  description: string;
  delivery_text: string;
  image_url: string | null;
  covers: string[];
  receive: string[];
  faqs: { q: string; a: string }[];
  active: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type BookingRow = {
  id: string;
  public_ref: string;
  service_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date_of_birth: string | null;
  birth_time: string | null;
  birth_place: string;
  question: string | null;
  status: BookingStatus;
  amount: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  booking_id: string;
  gateway: string;
  gateway_txn_id: string | null;
  gateway_payment_id: string | null;

  amount: number;
  status: OrderStatus;
  raw_request: Record<string, unknown> | null;
  raw_response: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type PaymentRow = {
  id: string;
  order_id: string;
  event_type: string;
  event_status: string;
  raw_payload: Record<string, unknown> | null;
  created_at: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  status: ContactStatus;
  created_at: string;
  updated_at: string;
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  read_time: number;
  published: boolean;
  published_at: string | null;
  hero_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
};

export type TestimonialRow = {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  approved: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SiteSettingRow = {
  id: string;
  key: string;
  value: unknown;
  created_at: string;
  updated_at: string;
};

export type AdminProfileRow = {
  id: string;
  user_id: string;
  role: AdminRole;
  full_name: string;
  created_at: string;
  updated_at: string;
};

export type AuditLogRow = {
  id: string;
  actor_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

// ─── Insert types (omit server-generated fields) ────────────

export type ServiceInsert = Omit<ServiceRow, "id" | "created_at" | "updated_at">;
export type BookingInsert = Omit<BookingRow, "id" | "created_at" | "updated_at">;
export type OrderInsert = Omit<OrderRow, "id" | "created_at" | "updated_at">;
export type PaymentInsert = Omit<PaymentRow, "id" | "created_at">;
export type ContactMessageInsert = Omit<ContactMessageRow, "id" | "created_at" | "updated_at">;
export type BlogPostInsert = Omit<BlogPostRow, "id" | "created_at" | "updated_at">;
export type TestimonialInsert = Omit<TestimonialRow, "id" | "created_at" | "updated_at">;
export type SiteSettingInsert = Omit<SiteSettingRow, "id" | "created_at" | "updated_at">;
export type AuditLogInsert = Omit<AuditLogRow, "id" | "created_at">;

// ─── Supabase Database type (for createClient<Database>) ────

type Rel = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export interface Database {
  public: {
    Tables: {
      services: {
        Row: ServiceRow;
        Insert: {
          id?: string;
          slug: string;
          name: string;
          price?: number;
          category?: string;
          tagline?: string;
          description?: string;
          delivery_text?: string;
          image_url?: string | null;
          covers?: string[] | unknown;
          receive?: string[] | unknown;
          faqs?: { q: string; a: string }[] | unknown;
          active?: boolean;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          price?: number;
          category?: string;
          tagline?: string;
          description?: string;
          delivery_text?: string;
          image_url?: string | null;
          covers?: string[] | unknown;
          receive?: string[] | unknown;
          faqs?: { q: string; a: string }[] | unknown;
          active?: boolean;
          sort_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      bookings: {
        Row: BookingRow;
        Insert: {
          id?: string;
          public_ref: string;
          service_id: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          date_of_birth?: string | null;
          birth_time?: string | null;
          birth_place: string;
          question?: string | null;
          status?: BookingStatus;
          amount?: number;
          currency?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          public_ref?: string;
          service_id?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          date_of_birth?: string | null;
          birth_time?: string | null;
          birth_place?: string;
          question?: string | null;
          status?: BookingStatus;
          amount?: number;
          currency?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: OrderRow;
        Insert: {
          id?: string;
          booking_id: string;
          gateway?: string;
          gateway_txn_id?: string | null;
          gateway_payment_id?: string | null;

          amount?: number;
          status?: OrderStatus;
          raw_request?: Record<string, unknown> | null;
          raw_response?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          gateway?: string;
          gateway_txn_id?: string | null;
          gateway_payment_id?: string | null;

          amount?: number;
          status?: OrderStatus;
          raw_request?: Record<string, unknown> | null;
          raw_response?: Record<string, unknown> | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          },
        ];
      };
      payments: {
        Row: PaymentRow;
        Insert: {
          id?: string;
          order_id: string;
          event_type: string;
          event_status: string;
          raw_payload?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          event_type?: string;
          event_status?: string;
          raw_payload?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          topic: string;
          message: string;
          status?: ContactStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          topic?: string;
          message?: string;
          status?: ContactStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPostRow;
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category?: string;
          excerpt?: string;
          body?: string;
          read_time?: number;
          published?: boolean;
          published_at?: string | null;
          hero_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: string;
          excerpt?: string;
          body?: string;
          read_time?: number;
          published?: boolean;
          published_at?: string | null;
          hero_image_url?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: {
          id?: string;
          name: string;
          location?: string;
          rating?: number;
          review: string;
          approved?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          rating?: number;
          review?: string;
          approved?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: {
          id?: string;
          key: string;
          value?: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: unknown;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_profiles: {
        Row: AdminProfileRow;
        Insert: {
          id?: string;
          user_id: string;
          role?: AdminRole;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: AdminRole;
          full_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: {
          id?: string;
          actor_user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          details?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_user_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          details?: Record<string, unknown> | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      booking_status: BookingStatus;
      order_status: OrderStatus;
      contact_status: ContactStatus;
      admin_role: AdminRole;
    };
    CompositeTypes: Record<string, never>;
  };
}
