import { useState } from "react";
import { Link } from "react-router";
import { AlertTriangle, MapPin, MessageSquare, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useEmergencyContacts, type EmergencyRole } from "@/hooks/useEmergencyContacts";
import { SAFETY_PATH_BY_ROLE, getPathByRole } from "@/constants/paths";

type EmergencySOSButtonProps = {
  isActiveRide: boolean;
  role: EmergencyRole;
  emergencyNumber?: string;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

const getGoogleMapsUrl = (coordinates: Coordinates) =>
  `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;

const toWhatsAppNumber = (value: string) => value.replace(/\D/g, "");

const getCurrentCoordinates = async (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported in this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        reject(new Error("Unable to fetch current location."));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });

export const EmergencySOSButton = ({
  isActiveRide,
  role,
  emergencyNumber = "999",
}: EmergencySOSButtonProps) => {
  const { contacts } = useEmergencyContacts(role);
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<Coordinates | null>(null);

  if (!isActiveRide) {
    return null;
  }

  const ensureLocation = async () => {
    if (location) return location;

    setIsLocating(true);
    try {
      const coordinates = await getCurrentCoordinates();
      setLocation(coordinates);
      return coordinates;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to fetch current location.";
      toast.error(message);
      return null;
    } finally {
      setIsLocating(false);
    }
  };

  const handleDialogToggle = (next: boolean) => {
    setIsOpen(next);
    if (next && !location) {
      void ensureLocation();
    }
  };

  const handleCallPolice = () => {
    window.location.href = `tel:${emergencyNumber}`;
    toast.info("Opening the dialer. Call emergency services directly if you are in danger.");
  };

  const getEmergencyMessage = (coordinates: Coordinates | null) => {
    const locationText = coordinates
      ? getGoogleMapsUrl(coordinates)
      : "Current location unavailable";

    return `Emergency alert. I need help during an active ride. My location: ${locationText}`;
  };

  const handleNotifyContactBySms = async () => {
    const contact = contacts[0];
    if (!contact) {
      toast.error("No emergency contact found. Add one from Safety Settings.");
      return;
    }

    const coordinates = await ensureLocation();
    const message = getEmergencyMessage(coordinates);
    window.location.href = `sms:${contact.phone}?body=${encodeURIComponent(message)}`;
    toast.info(`SMS app opened for ${contact.name}. Send the message to alert them.`);
    setIsOpen(false);
  };

  const handleNotifyContactByWhatsApp = async () => {
    const contact = contacts[0];
    if (!contact) {
      toast.error("No emergency contact found. Add one from Safety Settings.");
      return;
    }

    const coordinates = await ensureLocation();
    const message = getEmergencyMessage(coordinates);
    const phone = toWhatsAppNumber(contact.phone);

    if (!phone) {
      toast.error("Emergency contact phone format is invalid.");
      return;
    }

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    toast.info(`WhatsApp opened for ${contact.name}. Send the message to alert them.`);
    setIsOpen(false);
  };

  const handleShareLiveLocation = async () => {
    const coordinates = await ensureLocation();
    if (!coordinates) return;

    const url = getGoogleMapsUrl(coordinates);
    const shareData = {
      title: "Live location",
      text: "Sharing my live location from ride app safety mode.",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.info("Share sheet opened. Confirm the share to send your location.");
      } catch {
        toast.error("Unable to share location.");
      }
      setIsOpen(false);
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      toast.info("Location link copied. Send it to your contact.");
      setIsOpen(false);
    } catch {
      toast.error("Unable to copy location link.");
    }
  };

  return (
    <>
      <Button
        type="button"
        aria-label="Open emergency SOS options"
        onClick={() => handleDialogToggle(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-destructive text-destructive-foreground shadow-lg hover:opacity-95"
      >
        <AlertTriangle className="h-6 w-6" />
      </Button>

      <Dialog open={isOpen} onOpenChange={handleDialogToggle}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Emergency SOS
            </DialogTitle>
            <DialogDescription>
              Open an emergency call or a pre-filled message. GoMove does not
              dispatch emergency services or confirm delivery.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground" aria-live="polite">
              {isLocating ? "Detecting your location..." : location ? "Location detected." : "Location not detected yet."}
              <div className="mt-2">
                <Link to={getPathByRole(role, SAFETY_PATH_BY_ROLE)} className="font-medium text-primary underline">
                  Manage emergency contacts
                </Link>
              </div>
            </div>

            <Button type="button" onClick={handleCallPolice} className="w-full justify-start gap-2" variant="destructive">
              <Phone className="h-4 w-4" />
              Call Police ({emergencyNumber})
            </Button>

            <Button type="button" onClick={handleNotifyContactBySms} className="w-full justify-start gap-2">
              <MessageSquare className="h-4 w-4" />
              Open SMS with location
            </Button>

            <Button
              type="button"
              onClick={handleNotifyContactByWhatsApp}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <MessageSquare className="h-4 w-4" />
              Open WhatsApp with location
            </Button>

            <Button
              type="button"
              onClick={handleShareLiveLocation}
              className="w-full justify-start gap-2"
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
              Share location link
            </Button>
          </div>

          <Separator />
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-4 w-4" />
            SOS appears only during active rides. GoMove does not dispatch
            emergency services; call local emergency services if you are in
            immediate danger.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
};
