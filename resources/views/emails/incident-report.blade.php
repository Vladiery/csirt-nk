LAPORAN INSIDEN SIBER NK-CSIRT

Kode pelacakan: {{ $report->tracking_code }}
Waktu laporan: {{ $report->created_at?->format('d-m-Y H:i:s') }}

INFORMASI PELAPOR
Nama: {{ $report->reporter_name ?: 'Anonim' }}
Email: {{ $report->reporter_email ?: 'Tidak dicantumkan' }}

DETAIL INSIDEN
Kategori: {{ $report->category }}
Ringkasan: {{ $report->subject }}
Waktu kejadian: {{ $report->occurred_at?->format('d-m-Y H:i:s') ?: 'Tidak dicantumkan' }}
URL atau sistem terdampak: {{ $report->affected_url ?: 'Tidak dicantumkan' }}

KRONOLOGI DAN DETAIL
{{ $report->description }}

LAMPIRAN BUKTI
@forelse ($report->evidence_paths ?? [] as $evidencePath)
- {{ basename($evidencePath) }}
@empty
Tidak ada lampiran.
@endforelse

Lampiran bukti disimpan secara privat di sistem pelaporan. Nama lampiran dapat dilihat pada detail laporan di panel admin.
