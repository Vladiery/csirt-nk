<?php

namespace App\Notifications;

use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewIncidentReportNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly Report $report) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /** @return array<string, mixed> */
    public function toArray(object $notifiable): array
    {
        return [
            'report_id' => $this->report->id,
            'subject' => $this->report->subject,
            'category' => $this->report->category,
            'tracking_code' => $this->report->tracking_code,
        ];
    }
}
