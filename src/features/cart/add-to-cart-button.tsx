"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Money } from "@/core/domain/models";
import { Button } from "@/components/ui/button";

import { useCartStore } from "./cart-store";

interface AddToCartButtonProps {
  productId: string;
  sku: string;
  name: string;
  moq: number;
  increment: number;
  unitPrice: Money;
  imageUrl: string;
  className?: string;
}

export function AddToCartButton(props: AddToCartButtonProps) {
  const t = useTranslations("common");
  const addLine = useCartStore((state) => state.addLine);
  const { className, ...line } = props;

  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={() => {
        addLine({ ...line, quantity: props.moq });
        toast.success(`${props.sku} · ${props.moq} pcs`);
      }}
      className={className}
      aria-label={`${t("add")} ${props.sku}`}
    >
      <Plus className="size-3.5" aria-hidden="true" />
      <span className="hidden sm:inline">{t("add")}</span>
    </Button>
  );
}
